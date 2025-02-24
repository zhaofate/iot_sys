import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  // 在 providers 中配置更多授权服务
  providers: [
    //github授权登录
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // 邮箱
    EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        //maxAge: 24 * 60 * 60, // 设置邮箱链接失效时间，默认24小时
      }),
  ],
  pages: {
    signIn: '/auth/login',
},
}

export default NextAuth(authOptions)
