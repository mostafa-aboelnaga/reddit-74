import DiscordProvider from "next-auth/providers/discord";
import NextAuth from "next-auth";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET,
    }),
  ],
});
