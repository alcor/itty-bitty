from recipe_scrapers import scrape_me
import json
import sys

# give the url as a string, it can be url from any site listed below
scraper = scrape_me(sys.argv[1])

recipe = {
  'name': scraper.title(),
  'totalTime': "PT" + str(scraper.total_time()) + "M",
  'recipeYield': scraper.yields(),
  'recipeIngredient': scraper.ingredients(),
  'recipeInstructions': scraper.instructions(),
  'image': [scraper.image()],
  'host': scraper.host(),
  'nutrition': scraper.nutrients()
}

json_string = json.dumps(recipe)
print(json_string)