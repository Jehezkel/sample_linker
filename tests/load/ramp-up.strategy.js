import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  stages: [
    { duration: "15s", target: 20 },
    { duration: "30s", target: 5 },
    { duration: "5s", target: 50 },
  ],
  //   stages: [{ duration: "15s", target: 20 }],
};

export default function () {
  const payload = JSON.stringify({
    email: "admin@gmail.com",
    pass: "pass123",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = http.post("http://localhost:7000/user/signin", payload, params);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
