export default {
  providers: [
    {
      domain: process.env.CLERK_ISSUER,
      applicationID: "convex",
    },
  ],
};
