from PIL import Image

im = Image.open(r'C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\adobo.png')
# Crop the chicken bowl (approx: x: 340 to 990, y: 15 to 600)
# Let's inspect the bounding box
crop_box = (340, 20, 990, 600)
dish = im.crop(crop_box)
dish.save(r'C:\Users\mic fano\.gemini\antigravity\brain\9cab03bb-d8ff-408b-aa09-850ae10dda0a\scratch\dish_adobo.png')
print("Cropped dish image saved with size:", dish.size)
