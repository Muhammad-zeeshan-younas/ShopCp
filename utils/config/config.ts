const dev = {
  backend_url: "http://localhost:3002",
  google_api_key: "707294026536-779cnfq2m9l7cra47ojb1v4s1ccuhvi7.apps.googleusercontent.com",
  facebook_app_id: "944594920018386",
};

const staging = {
  backend_url: "https://staging-backend.tapp.events/api/v1",
  google_api_key: "707294026536-779cnfq2m9l7cra47ojb1v4s1ccuhvi7.apps.googleusercontent.com",
  facebook_app_id: "944594920018386",
};

const production = {
  backend_url: "https://backend.tapp.events/api/v1",
  google_api_key: "707294026536-779cnfq2m9l7cra47ojb1v4s1ccuhvi7.apps.googleusercontent.com",
  facebook_app_id: "944594920018386",
};

export const config = () => {
  if (process.env.REACT_APP_STAGE === "production") {
    return production;
  } else if (process.env.REACT_APP_STAGE === "staging") {
    return staging;
  } else {
    return dev;
  }
};
