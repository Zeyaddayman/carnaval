import Link from "next/link"
import { SlSocialFacebook, SlSocialInstagram, SlSocialLinkedin, SlSocialTwitter } from "react-icons/sl"

const Footer = () => {
    return (
        <footer className="bg-bar">
            <div className="element-center py-16 flex-col gap-5 border-y border-border">
                <p className="font-semibold">Connect With Us</p>
                <div className="flex gap-3">
                    <Link
                        href={"https://www.facebook.com/carnaval"}
                        target="_blank"
                        className="hover:text-primary transition"
                    >
                        <SlSocialFacebook />
                    </Link>
                    <Link
                        href={"https://www.instagram.com/carnaval"}
                        target="_blank"
                        className="hover:text-primary transition"
                    >
                        <SlSocialInstagram />
                    </Link>
                    <Link
                        href={"https://x.com/carnaval"}
                        target="_blank"
                        className="hover:text-primary transition"
                    >
                        <SlSocialTwitter />
                    </Link>
                    <Link
                        href={"https://www.linkedin.com/in/carnaval"}
                        target="_blank"
                        className="hover:text-primary transition"
                    >
                        <SlSocialLinkedin />
                    </Link>
                </div>
            </div>
            <p className="text-center p-4">
                © 2025 Carnaval. All rights reserved. Made by {" "}
                <Link
                    href={"https://github.com/Zeyaddayman"}
                    target="_blank"
                    className="text-primary font-semibold"
                >
                    Zeyad Ayman
                </Link>
            </p>
        </footer>
    )
}

export default Footer