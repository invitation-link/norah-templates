# Convert images from PNG to WebP and organize into date-wise folders
# Run this script from the invite-platform directory

$sourceDir = "C:\Users\venka\.gemini\antigravity\brain\d6841a84-4a0b-443c-b4d9-a886527d1280"
$targetBase = ".\social-media-campaign\2026-01-13"
$assetsDir = ".\social-media-campaign\assets"

# Image mappings: source name -> target folder
$imageMappings = @{
    # Instagram posts
    "ig_post_wedding_invite_1768275426552.png"      = @{folder = "instagram"; name = "wedding-invite-south-indian" }
    "ig_post_birthday_1768275929552.png"            = @{folder = "instagram"; name = "birthday-party-neon" }
    "ig_post_photographer_collab_1768275441955.png" = @{folder = "instagram"; name = "photographer-partnership" }
    "ig_carousel_slide1_1768275948287.png"          = @{folder = "instagram"; name = "5-reasons-digital-beats-paper" }
    "ig_reel_cover_wedding_1768275911849.png"       = @{folder = "instagram"; name = "wedding-reveal-reel-cover" }
    "ig_post_venue_partner_1768306740944.png"       = @{folder = "instagram"; name = "venue-hall-partnership" }
    "ig_post_event_planner_1768306761041.png"       = @{folder = "instagram"; name = "event-planner-rsvp" }
    "ig_post_housewarming_1768306782013.png"        = @{folder = "instagram"; name = "griha-pravesh-housewarming" }
    "ig_post_baby_shower_1768306806804.png"         = @{folder = "instagram"; name = "baby-shower-invitation" }
    "invitation_link_hook_post_1767956302991.png"   = @{folder = "instagram"; name = "make-it-magical-hook" }
    "ig_launch_post_1767955209118.png"              = @{folder = "instagram"; name = "launch-announcement" }
    
    # WhatsApp statuses
    "whatsapp_status_1_1768276360188.png"           = @{folder = "whatsapp"; name = "first-impression" }
    "whatsapp_status_2_1768276388657.png"           = @{folder = "whatsapp"; name = "rsvp-pain-point" }
    "whatsapp_status_3_1768276424284.png"           = @{folder = "whatsapp"; name = "paper-vs-digital" }
    
    # Stories
    "ig_story_daily_template_1768275461478.png"     = @{folder = "stories"; name = "daily-status-template" }
    
    # Logos
    "invitation_link_logo_v2_1768275406757.png"     = @{folder = "logos"; name = "invitation-link-logo-v2"; isAsset = $true }
    "invitation_link_brand_logo_1767952254425.png"  = @{folder = "logos"; name = "invitation-link-logo-v1"; isAsset = $true }
}

# SEO metadata for each image
$seoData = @{
    "wedding-invite-south-indian"   = @{
        alt      = "South Indian Wedding Digital Invitation Template - Invitation Link"
        title    = "Beautiful Digital Wedding Invitation with Traditional Motifs"
        keywords = @("wedding invitation", "south indian wedding", "digital wedding card", "shaadi card", "telugu wedding invite")
    }
    "birthday-party-neon"           = @{
        alt      = "Neon Birthday Party Digital Invitation - Colorful and Fun"
        title    = "Birthday Party Invitation Templates - Fun and Vibrant"
        keywords = @("birthday invitation", "party invite", "neon party", "birthday card online", "kids birthday")
    }
    "photographer-partnership"      = @{
        alt      = "Wedding Photographer Partnership Program - Invitation Link"
        title    = "Partner with Us - Wedding Photography Business Opportunity"
        keywords = @("wedding photographer", "photography partnership", "photographer collaboration", "wedding vendor")
    }
    "5-reasons-digital-beats-paper" = @{
        alt      = "5 Reasons Digital Invitations Are Better Than Paper"
        title    = "Why Choose Digital Invitations Over Traditional Paper Cards"
        keywords = @("digital vs paper", "eco friendly invitation", "modern wedding", "cost effective invite")
    }
    "venue-hall-partnership"        = @{
        alt      = "Function Hall Partnership - Invitation Link"
        title    = "Partner Your Venue with Digital Invitations"
        keywords = @("function hall", "banquet hall", "venue partnership", "wedding venue", "event venue")
    }
    "event-planner-rsvp"            = @{
        alt      = "Event Planner RSVP Tracking Dashboard - Invitation Link"
        title    = "Event Planners Save Hours with Built-in RSVP Tracking"
        keywords = @("event planner", "rsvp tracking", "guest management", "wedding planner", "event management")
    }
    "griha-pravesh-housewarming"    = @{
        alt      = "Griha Pravesh Housewarming Digital Invitation - Traditional Indian"
        title    = "Beautiful Housewarming Invitation Templates"
        keywords = @("griha pravesh", "housewarming", "housewarming invitation", "indian ceremony", "pooja invitation")
    }
    "baby-shower-invitation"        = @{
        alt      = "Baby Shower Digital Invitation - Cute and Adorable"
        title    = "Baby Shower Invitation Templates - Sweet and Heartwarming"
        keywords = @("baby shower", "baby shower invitation", "godh bharai", "baby celebration", "pastel invitation")
    }
    "first-impression"              = @{
        alt      = "Your Invite is Your First Impression - WhatsApp Status"
        title    = "Make Your Wedding Invite Count"
        keywords = @("first impression", "wedding invite", "whatsapp status", "invitation marketing")
    }
    "rsvp-pain-point"               = @{
        alt      = "Stop Calling Guests for RSVP - Digital Solution"
        title    = "RSVP Tracking Made Easy with Digital Invitations"
        keywords = @("rsvp tracking", "guest rsvp", "event planning", "invitation rsvp")
    }
    "paper-vs-digital"              = @{
        alt      = "Paper Invites vs Digital - Cost Comparison"
        title    = "The Clear Choice - Free Digital vs Expensive Paper"
        keywords = @("paper vs digital", "invitation cost", "free invitation", "digital vs paper")
    }
}

Write-Host "Image Conversion Script - Invitation Link Social Media Campaign" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Process each image
foreach ($source in $imageMappings.Keys) {
    $mapping = $imageMappings[$source]
    $sourcePath = Join-Path $sourceDir $source
    
    if ($mapping.isAsset) {
        $targetDir = Join-Path $assetsDir $mapping.folder
    }
    else {
        $targetDir = Join-Path $targetBase $mapping.folder
    }
    
    $targetName = $mapping.name
    $targetPath = Join-Path $targetDir "$targetName.png"
    $webpPath = Join-Path $targetDir "$targetName.webp"
    $seoPath = Join-Path $targetDir "$targetName.seo.json"
    
    if (Test-Path $sourcePath) {
        # Copy the PNG file
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-Host "Copied: $source -> $targetPath" -ForegroundColor Green
        
        # Create SEO JSON
        if ($seoData.ContainsKey($targetName)) {
            $metadata = $seoData[$targetName]
            $seoObj = @{
                filename    = "$targetName.webp"
                alt         = $metadata.alt
                title       = $metadata.title
                keywords    = $metadata.keywords
                dateCreated = "2026-01-13"
                platform    = "Invitation Link"
                openGraph   = @{
                    "og:image:alt"  = $metadata.alt
                    "og:image:type" = "image/webp"
                }
                schema      = @{
                    "@type"       = "ImageObject"
                    "name"        = $metadata.title
                    "description" = $metadata.alt
                    "keywords"    = ($metadata.keywords -join ", ")
                }
            }
            $seoObj | ConvertTo-Json -Depth 5 | Out-File -FilePath $seoPath -Encoding UTF8
            Write-Host "  Created SEO: $seoPath" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "NOT FOUND: $sourcePath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! Images copied to date-wise folders." -ForegroundColor Cyan
Write-Host ""
Write-Host "To convert to WebP, install sharp and run:" -ForegroundColor Yellow
Write-Host "  npm install sharp" -ForegroundColor White
Write-Host "  node convert-to-webp.js" -ForegroundColor White
