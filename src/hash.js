import bcrypt from "bcryptjs";

const hash = "$2b$10$uFN3MK71vyPGEyR346/cw.VGeoFNwsGL.q3xjl8iePes375EBLx.2";

const result = await bcrypt.compare("12345", hash);

console.log(result);