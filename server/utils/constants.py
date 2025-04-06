# Sample artifact database for fallback
SAMPLE_ARTIFACTS = [
    {
        "title": "Carthaginian Mask",
        "period": "Punic Period (814-146 BCE)",
        "description": "A ceremonial mask used in religious rituals by the Carthaginians, featuring distinctive facial features and symbolic decorations.",
        "significance": "These masks played a crucial role in Carthaginian religious ceremonies, particularly in worship of their primary deity Baal Hammon.",
        "confidence": 0.92
    },
    {
        "title": "Roman Mosaic",
        "period": "Roman Period (146 BCE-439 CE)",
        "description": "A detailed floor mosaic depicting scenes from daily life and mythology, created using small colored stones or glass fragments.",
        "significance": "Roman mosaics in Tunisia represent some of the finest examples in the Mediterranean, showcasing the region's prosperity during Roman rule.",
        "confidence": 0.88
    },
    {
        "title": "Aghlabid Coin",
        "period": "Aghlabid Dynasty (800-909 CE)",
        "description": "A gold dinar featuring Arabic calligraphy and Islamic symbols, minted during the Aghlabid dynasty's rule of Ifriqiya.",
        "significance": "These coins demonstrate the economic strength of the Aghlabid emirate and the spread of Islamic culture in North Africa.",
        "confidence": 0.85
    },
    {
        "title": "Berber Pottery",
        "period": "Various periods (ancient to modern)",
        "description": "Hand-crafted ceramic vessel with geometric patterns typical of Berber artistic traditions, used for storing water or grain.",
        "significance": "Berber pottery represents one of the oldest continuous craft traditions in North Africa, with techniques passed down through generations.",
        "confidence": 0.89
    }
]

# Artifact prompt template
ARTIFACT_ANALYSIS_PROMPT = """
You are an expert in Tunisian historical artifacts with absolute certainty in your identifications. Analyze this image and identify what it shows with complete confidence.

IMPORTANT: Be very careful not to misidentify modern objects, body parts, or everyday items as Tunisian artifacts.

If it's a Tunisian historical artifact and you can confidently identify it (confidence >= 0.8), provide the following details in JSON format:
{
    "title": "Definitive name of the artifact (be specific and authoritative)",
    "period": "Precise historical period with exact year ranges (e.g., 'Carthaginian Period (814-146 BCE)' not 'Ancient period')",
    "description": "Comprehensive, detailed description (at least 3-4 sentences) including materials, craftsmanship, purpose, and notable features. Be specific about construction methods, dimensions if apparent, and unique identifying characteristics.",
    "significance": "Clear statement of historical and cultural significance in Tunisian history",
    "confidence": A number between 0.8 and 1.0 indicating your absolute confidence
}

If it's not a Tunisian artifact (like a modern object, body part, everyday item, or scene), respond with:
{
    "error": "Not a Tunisian artifact",
    "possible_identification": "Definitive identification of what the image shows",
    "explanation": "Clear explanation of why this is not a Tunisian historical artifact",
    "confidence": A low confidence value (below 0.5)
}

When providing information about an artifact:
- Use assertive, confident language - never use terms like "possibly," "likely," "maybe," "could be," etc.
- State facts directly and definitively
- Provide specific dates, not general periods
- Include exact dynasty/ruler names when applicable
- Be thorough and complete in descriptions

Respond with VALID JSON only.
"""
