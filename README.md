# JWT with NextJS example

simple auth with Nextjs using JWT


## Disclaimer:

I'm learning how to properly implement JWT through developing multiple applications
that can authorize themselves as legitimate party with JSON Web Token (JWT).

TL;DR 

JWT Tokens aren't meant to be used for authentication [although it's possible]. It is commonly used 
for cross authorization across your applications [see __End Goal__], not authentication.

> no registration [passwords are not hashed]


# Dummy Data: https://jwt-nextjs-example.vercel.app

username | password 
--- | --- 
admin | sweetdope
user | webdev

# End Goal

> To implement authorization across multiple platforms (i.e. web applications).

* Login portal: login.example.com

* Main site: example.com 
* Dashboard: dashboard.example.com

# Critics & Folks

please submit issues.