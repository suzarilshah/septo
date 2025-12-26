import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { osintSearches, entities, userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { socialPlatforms, categories } from "@/lib/osint/platforms";
import axios from "axios";

// Rate limiting: simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 10) { // 10 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

// Check if URL returns 200 (profile exists)
async function checkUrlExists(url: string): Promise<{ exists: boolean; statusCode?: number }> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      validateStatus: () => true,
    });
    
    return {
      exists: response.status === 200,
      statusCode: response.status,
    };
  } catch {
    return { exists: false };
  }
}

// Username enumeration across platforms
async function searchUsername(username: string): Promise<{
  platforms: Array<{
    name: string;
    url: string;
    exists: boolean;
    category: string;
  }>;
  summary: string;
}> {
  const results: Array<{
    name: string;
    url: string;
    exists: boolean;
    category: string;
  }> = [];

  // Check top 20 platforms (to avoid rate limiting and keep response fast)
  const topPlatforms = socialPlatforms.slice(0, 20);
  
  const checks = await Promise.allSettled(
    topPlatforms.map(async (platform) => {
      const url = platform.url.replace("{}", username);
      const { exists } = await checkUrlExists(url);
      return {
        name: platform.name,
        url,
        exists,
        category: platform.category,
      };
    })
  );

  for (const check of checks) {
    if (check.status === "fulfilled") {
      results.push(check.value);
    }
  }

  const foundCount = results.filter((r) => r.exists).length;
  const summary = `Found ${foundCount} profiles for username "${username}" across ${results.length} platforms checked.`;

  return { platforms: results, summary };
}

// Email intelligence
async function searchEmail(email: string, apiKeys: { hunter?: string; hibp?: string }): Promise<{
  platforms: Array<{
    name: string;
    url?: string;
    exists: boolean;
    data?: Record<string, unknown>;
  }>;
  summary: string;
}> {
  const results: Array<{
    name: string;
    url?: string;
    exists: boolean;
    data?: Record<string, unknown>;
  }> = [];

  // Hunter.io lookup
  if (apiKeys.hunter) {
    try {
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKeys.hunter}`
      );
      
      if (response.data.data) {
        results.push({
          name: "Hunter.io Email Verification",
          exists: response.data.data.status === "valid",
          data: {
            status: response.data.data.status,
            score: response.data.data.score,
            disposable: response.data.data.disposable,
            webmail: response.data.data.webmail,
            mx_records: response.data.data.mx_records,
            smtp_check: response.data.data.smtp_check,
          },
        });
      }
    } catch (error) {
      console.error("Hunter.io error:", error);
    }
  }

  // Have I Been Pwned
  if (apiKeys.hibp) {
    try {
      const response = await axios.get(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
        {
          headers: {
            "hibp-api-key": apiKeys.hibp,
            "User-Agent": "SEPTO-OSINT",
          },
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        results.push({
          name: "Have I Been Pwned",
          exists: true,
          data: {
            breachCount: response.data.length,
            breaches: response.data.map((b: { Name: string; BreachDate: string; DataClasses: string[] }) => ({
              name: b.Name,
              date: b.BreachDate,
              dataTypes: b.DataClasses,
            })),
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        results.push({
          name: "Have I Been Pwned",
          exists: false,
          data: { message: "No breaches found" },
        });
      }
    }
  }

  // Check Gravatar
  try {
    const crypto = await import("crypto");
    const hash = crypto.createHash("md5").update(email.toLowerCase().trim()).digest("hex");
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;
    const { exists } = await checkUrlExists(gravatarUrl);
    
    results.push({
      name: "Gravatar",
      url: `https://en.gravatar.com/${hash}`,
      exists,
    });
  } catch {
    // Skip gravatar check
  }

  const foundCount = results.filter((r) => r.exists).length;
  const summary = `Found ${foundCount} results for email "${email}".`;

  return { platforms: results, summary };
}

// Domain intelligence
async function searchDomain(domain: string, apiKeys: { virustotal?: string; shodan?: string }): Promise<{
  platforms: Array<{
    name: string;
    url?: string;
    exists: boolean;
    data?: Record<string, unknown>;
  }>;
  summary: string;
}> {
  const results: Array<{
    name: string;
    url?: string;
    exists: boolean;
    data?: Record<string, unknown>;
  }> = [];

  // Basic DNS check
  try {
    const dns = await import("dns").then(m => m.promises);
    const records = await dns.resolve(domain);
    results.push({
      name: "DNS Records",
      exists: true,
      data: { aRecords: records },
    });
  } catch {
    results.push({
      name: "DNS Records",
      exists: false,
      data: { message: "No DNS records found" },
    });
  }

  // VirusTotal
  if (apiKeys.virustotal) {
    try {
      const response = await axios.get(
        `https://www.virustotal.com/api/v3/domains/${domain}`,
        {
          headers: { "x-apikey": apiKeys.virustotal },
        }
      );
      
      if (response.data.data) {
        const attrs = response.data.data.attributes;
        results.push({
          name: "VirusTotal",
          url: `https://www.virustotal.com/gui/domain/${domain}`,
          exists: true,
          data: {
            reputation: attrs.reputation,
            lastAnalysisStats: attrs.last_analysis_stats,
            registrar: attrs.registrar,
            creationDate: attrs.creation_date,
            categories: attrs.categories,
          },
        });
      }
    } catch (error) {
      console.error("VirusTotal error:", error);
    }
  }

  // Shodan
  if (apiKeys.shodan) {
    try {
      const response = await axios.get(
        `https://api.shodan.io/dns/domain/${domain}?key=${apiKeys.shodan}`
      );
      
      if (response.data) {
        results.push({
          name: "Shodan DNS",
          url: `https://www.shodan.io/domain/${domain}`,
          exists: true,
          data: {
            subdomains: response.data.subdomains,
            records: response.data.data?.slice(0, 10),
          },
        });
      }
    } catch (error) {
      console.error("Shodan error:", error);
    }
  }

  const foundCount = results.filter((r) => r.exists).length;
  const summary = `Found ${foundCount} results for domain "${domain}".`;

  return { platforms: results, summary };
}

// Phone number lookup
async function searchPhone(phone: string): Promise<{
  platforms: Array<{
    name: string;
    url?: string;
    exists: boolean;
    data?: Record<string, unknown>;
  }>;
  summary: string;
}> {
  const results: Array<{
    name: string;
    url?: string;
    exists: boolean;
    data?: Record<string, unknown>;
  }> = [];

  // Basic phone validation
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const isValid = /^\+?[1-9]\d{6,14}$/.test(cleanPhone);

  results.push({
    name: "Phone Validation",
    exists: isValid,
    data: {
      originalInput: phone,
      cleanedNumber: cleanPhone,
      isValid,
      format: cleanPhone.startsWith("+") ? "International" : "Local",
    },
  });

  // Try to identify country from phone number
  if (cleanPhone.startsWith("+1")) {
    results.push({
      name: "Country Detection",
      exists: true,
      data: { country: "United States/Canada", countryCode: "+1" },
    });
  } else if (cleanPhone.startsWith("+44")) {
    results.push({
      name: "Country Detection",
      exists: true,
      data: { country: "United Kingdom", countryCode: "+44" },
    });
  } else if (cleanPhone.startsWith("+60")) {
    results.push({
      name: "Country Detection",
      exists: true,
      data: { country: "Malaysia", countryCode: "+60" },
    });
  }

  const summary = `Phone analysis completed for "${phone}".`;

  return { platforms: results, summary };
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before making more requests." },
        { status: 429 }
      );
    }

    const { searchType, query, userId } = await request.json();

    if (!searchType || !query) {
      return NextResponse.json(
        { error: "Missing searchType or query" },
        { status: 400 }
      );
    }

    // Get user's API keys
    let apiKeys: {
      hunter?: string;
      shodan?: string;
      virustotal?: string;
      hibp?: string;
    } = {};

    if (userId) {
      const settings = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, userId))
        .limit(1);

      if (settings.length > 0) {
        apiKeys = {
          hunter: settings[0].hunterApiKey || undefined,
          shodan: settings[0].shodanApiKey || undefined,
          virustotal: settings[0].virusTotalApiKey || undefined,
          hibp: settings[0].hibpApiKey || undefined,
        };
      }
    }

    let results;

    switch (searchType) {
      case "username":
        results = await searchUsername(query);
        break;
      case "email":
        results = await searchEmail(query, apiKeys);
        break;
      case "domain":
        results = await searchDomain(query, apiKeys);
        break;
      case "phone":
        results = await searchPhone(query);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid search type" },
          { status: 400 }
        );
    }

    // Store search in database
    const searchRecord = await db
      .insert(osintSearches)
      .values({
        userId: userId || null,
        searchType,
        query,
        results,
        status: "completed",
        completedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      searchId: searchRecord[0].id,
      ...results,
      categories,
    });
  } catch (error) {
    console.error("OSINT search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    const searches = await db
      .select()
      .from(osintSearches)
      .where(userId ? eq(osintSearches.userId, userId) : undefined)
      .orderBy(osintSearches.createdAt)
      .limit(limit);

    return NextResponse.json({ searches });
  } catch (error) {
    console.error("Failed to get OSINT searches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

