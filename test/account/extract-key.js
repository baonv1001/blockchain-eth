const keythereum = require("keythereum");
const fs = require("fs");

// 1. Đường dẫn tới file keystore
// node1
// const keyObject = JSON.parse(fs.readFileSync("F:\\UNIVERSITY\\KY 5\\JAVA PROGRAMING\\JAVA WEB\\SPRING CLOUD - MICROSERVICE\\Blockchain\\Lab_2\\node1\\keystore\\UTC--2025-04-08T07-13-37.856421400Z--04fbec3ac166fea2ce157f74962efe4c8aff7891", "utf8"));

// node2
const keyObject = JSON.parse(fs.readFileSync("F:\\UNIVERSITY\\KY 5\\JAVA PROGRAMING\\JAVA WEB\\SPRING CLOUD - MICROSERVICE\\Blockchain\\Lab_2\\node2\\keystore\\UTC--2025-04-08T07-16-01.048753800Z--444595d3aa12f83fed8bf7ae7bc01d2684ad463c", "utf8"));

// 2. Mật khẩu file keystore (đã dùng khi tạo account)
const password = "test"; // ✍️ sửa lại đúng

// 3. Giải mã
try {
  const privateKey = keythereum.recover(password, keyObject);
  console.log("PRIVATE KEY:", "0x" + privateKey.toString("hex"));
} catch (err) {
  console.error("❌ Sai mật khẩu hoặc file bị lỗi!", err.message);
}
