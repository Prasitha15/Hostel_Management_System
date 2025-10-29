import bcrypt from "bcrypt";

const hash = "$2b$10$N0o8pktlXQfSrnKJ35AwOMqXwV1S4w..."; // copy full hash from DB
const plain = "thepasswordyoutyped"; // type the exact password you used during student registration

bcrypt.compare(plain, hash).then(result => {
  console.log("Match?", result);
}).catch(err => {
  console.error("Error comparing:", err);
});
