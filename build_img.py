# Converte le immagini originali (_raw) e quelle migliorate con Real-ESRGAN in WebP + fallback, alle dimensioni usate nel sito.
from PIL import Image, ImageOps
import os, sys
R='_raw'; U=sys.argv[1]; O='img'
os.makedirs(O+'/premi',exist_ok=True)
def out(src,name,w,alpha=False,crop=None,q=82):
    im=Image.open(src); im=ImageOps.exif_transpose(im)
    im=im.convert('RGBA' if alpha else 'RGB')
    if crop: im=im.crop(crop)
    if im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    im.save(f'{O}/{name}.webp',quality=q,method=6)
    if alpha: im.save(f'{O}/{name}.png',optimize=True)
    else: im.save(f'{O}/{name}.jpg',quality=q,optimize=True,progressive=True)
    print(name,im.size)
J=lambda f:os.path.join(R,f)
out(J('Andrea-Bandiera-Scirocco-_MGL8586-Nikoboi2019-scaled.jpg'),'torta-mango',1800)
out(J('Andrea-Bandiera-Scirocco-_MGL8555-Nikoboi2019-scaled.jpg'),'torta-cioccolato',1800)
out(J('Andrea-Bandiera-Scirocco-_MGL8650-Nikoboi2019-scaled.jpg'),'bicchierino-fragola',1100)
out(J('Andrea-Bandiera-Scirocco-_MGL8667-Nikoboi2019-scaled.jpg'),'bicchierino-mango',1100)
out(J('Andrea-Bandiera-Scirocco-gelato-malaga-800px.png'),'cono-malaga',800,alpha=True)
out(J('slider-1-tiramisu.jpg'),'banner-tiramisu',1600)
out(J('slider-1-cioccolato.jpg'),'banner-cioccolato',1600)
out(J('slider-1-bicchieri.jpg'),'banner-bicchieri',1600)
out(J('slider-1-fresca-estate.jpg'),'banner-mango',1600)
out(J('image00001.jpeg'),'andrea-mara-banco',1000)
out(os.path.join(U,'cordialita-mara-andrea.png'),'andrea-mara',1100)
out(J('Foto-06-08-19-11-10-32.jpg'),'stecco-pistacchio',1400)
out(os.path.join(U,'Gelato_600px_Tesorini_1.png'),'tesorini',1400)
out(J('monoporzione-scirocco.jpg'),'monoporzione',828)
out(os.path.join(U,'tappi_gelato.png'),'pozzetti',1400)
out(os.path.join(U,'fragola1.png'),'ing-fragola',520,alpha=True)
out(os.path.join(U,'vaniglia-150x150-1.png'),'ing-vaniglia',520,alpha=True)
out(os.path.join(U,'limone2.png'),'ing-limone',520)
out(os.path.join(U,'latte-fresco.png'),'ing-latte',500,alpha=True)
out(J('bacca-di-vaniglia-600x379.png'),'bacca-vaniglia',600,alpha=True)
out(J('colori-naturali.png'),'colori-naturali',400,alpha=True)
out(os.path.join(U,'logo.png'),'logo-andrea-bandiera',992,alpha=True)
P=[('2027-3Coni-GamberoRosso.jpg','2027'),('gambero_rosso_2025.jpg','2025'),('gambero_rosso_2024.jpg','2024'),
   (os.path.join('..',U,'guida-gelaterie-2023-articolo-768x576-1.png'),'2023'),('gelaterie-2022-cover-1080x762-1.jpg','2022'),
   ('DipGelaterie2021TRECONI-31-scaled.jpg','2021'),('3conigambero2020-scaled.jpg','2020'),('tre_coni_gambero_2019-scaled.jpg','2019'),
   ('3-coni-gambero-2018-scaled.jpg','2018'),('gelato-gastronomico-gambero-2018-scaled-e1585915185148.jpg','2018-gastronomico'),
   ('3-coni-gambero-2017-scaled.jpg','2017'),('etichetta_3coni_gambero_rosso-2026-v1.jpg','etichetta-tre-coni')]
for f,n in P:
    src=f if os.path.isabs(f) else (os.path.join(U,os.path.basename(f)) if f.startswith('..') else J(f))
    out(src,'premi/'+n,800)
