module.exports = async function (context, req) {
  context.res = {
    headers: { "Content-Type": "application/json" },
    body: {
      clientName: "Club A Analytics",
      clientLogo: "/club-logo.png",
      tabs: {
        "League Table": true,
        "Profile": true,
        "Performance Rank": true,
        "Goal Impact": true,
        "Season on Season player": true,
        "Season on Season Club": true,
        "Fixture Results by xG": true,
        "Team Results by xG": true,
        "Title Race": true,
        "Fixtures and Results": true,
        "Attack Threat": true,
        "KPIs Plot": true,
        "Performance Metrics": true,
        "Team Fixture Performance": true,
        "Compare Performance Metrics": true,
        "Goal Placement": true,
        "Goal Categories": true,
        "Goal Categories2": true,
        "Goal Analysis": true,
        "Goal Flow": true
      }
    }
  };
};
