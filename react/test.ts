import sharp from 'sharp';
const optimizedBuffer = await sharp('./test.jpg')
    .resize({ width: 200 }) // Largeur max 200px (idéal pour une icône de châssis)
    .jpeg({ quality: 40 })  // Compression à 40% pour détruire le poids en octets
    .toBuffer();

// 2. Encodage en Base64
const base64String = optimizedBuffer.toString('base64');
console.log (base64String);