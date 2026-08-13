# Organize images for January 14, 2026

$sourceDir = "C:\Users\venka\.gemini\antigravity\brain\d6841a84-4a0b-443c-b4d9-a886527d1280"
$targetBase = ".\social-media-campaign\2026-01-14"

# Image mappings for Jan 14
$imageMappings = @{
    "ig_jan14_wedding_season_1768352372307.png"    = @{folder = "instagram"; name = "wedding-season-is-here" }
    "ig_jan14_reel_before_after_1768352393651.png" = @{folder = "instagram"; name = "before-after-glow-up" }
    "ig_jan14_testimonial_1768352409673.png"       = @{folder = "instagram"; name = "customer-testimonial-priya-rahul" }
    "ig_jan14_countdown_feature_1768352466135.png" = @{folder = "instagram"; name = "countdown-timer-feature" }
    "wa_jan14_tip_of_day_1768352429402.png"        = @{folder = "whatsapp"; name = "tip-background-music" }
    "wa_jan14_engagement_1768352445658.png"        = @{folder = "whatsapp"; name = "engagement-ring-ceremony" }
}

# SEO metadata
$seoData = @{
    "wedding-season-is-here"           = @{
        alt      = "Wedding Season Digital Invitation Templates - Invitation Link India"
        title    = "Wedding Season is Here - Create Your Invite Now"
        keywords = @("wedding season", "indian wedding", "wedding invitation", "shaadi season", "wedding 2026")
    }
    "before-after-glow-up"             = @{
        alt      = "Before After Wedding Invitation Comparison - Digital vs WhatsApp Image"
        title    = "The Glow Up Your Wedding Invite Needs"
        keywords = @("before after", "invitation upgrade", "digital invitation", "whatsapp invite")
    }
    "customer-testimonial-priya-rahul" = @{
        alt      = "Customer Review - Priya and Rahul Wedding Invitation Testimonial"
        title    = "What Our Customers Say About Invitation Link"
        keywords = @("testimonial", "customer review", "wedding invite review", "invitation link review")
    }
    "countdown-timer-feature"          = @{
        alt      = "Live Countdown Timer Feature in Digital Wedding Invitation"
        title    = "Build Excitement with Live Countdown in Your Invite"
        keywords = @("countdown timer", "wedding countdown", "invitation features", "live countdown")
    }
    "tip-background-music"             = @{
        alt      = "Tip of the Day - Add Background Music to Wedding Invitation"
        title    = "Add Music to Make Your Invite Memorable"
        keywords = @("background music", "invitation music", "wedding song", "invite tip")
    }
    "engagement-ring-ceremony"         = @{
        alt      = "Engagement Ring Ceremony Digital Invitation Template"
        title    = "Beautiful Engagement Invites That Sparkle"
        keywords = @("engagement invitation", "ring ceremony", "engagement invite", "roka invitation")
    }
}

Write-Host "Organizing January 14, 2026 Content" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

foreach ($source in $imageMappings.Keys) {
    $mapping = $imageMappings[$source]
    $sourcePath = Join-Path $sourceDir $source
    $targetDir = Join-Path $targetBase $mapping.folder
    $targetName = $mapping.name
    $targetPath = Join-Path $targetDir "$targetName.png"
    $seoPath = Join-Path $targetDir "$targetName.seo.json"
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-Host "Copied: $source" -ForegroundColor Green
        
        if ($seoData.ContainsKey($targetName)) {
            $metadata = $seoData[$targetName]
            $seoObj = @{
                filename    = "$targetName.webp"
                alt         = $metadata.alt
                title       = $metadata.title
                keywords    = $metadata.keywords
                dateCreated = "2026-01-14"
                platform    = "Invitation Link"
                openGraph   = @{ "og:image:alt" = $metadata.alt; "og:image:type" = "image/webp" }
            }
            $seoObj | ConvertTo-Json -Depth 5 | Out-File -FilePath $seoPath -Encoding UTF8
            Write-Host "  Created SEO: $targetName.seo.json" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "NOT FOUND: $source" -ForegroundColor Red
    }
}

Write-Host "`nDone! Now converting to WebP..." -ForegroundColor Cyan
