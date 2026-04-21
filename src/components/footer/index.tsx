import { Translation } from "@/types/translation"
import Link from "next/link"
import { SlSocialFacebook, SlSocialInstagram, SlSocialLinkedin, SlSocialTwitter } from "react-icons/sl"

const Footer = ({ translation }: { translation: Translation["footer"] }) => {
    return (
        <footer className="bg-bar">
            <div className="element-center py-16 flex-col gap-3 border-y border-border">
                <p className="font-semibold">{translation.connectWithUs}</p>
                <div className="flex gap-1">
                    <Link
                        href={"https://www.facebook.com/carnaval"}
                        target="_blank"
                        className="hover:text-primary p-2 transition"
                        aria-label="Facebook"
                    >
                        <SlSocialFacebook />
                    </Link>
                    <Link
                        href={"https://www.instagram.com/carnaval"}
                        target="_blank"
                        className="hover:text-primary p-2 transition"
                        aria-label="Instagram"
                    >
                        <SlSocialInstagram />
                    </Link>
                    <Link
                        href={"https://x.com/carnaval"}
                        target="_blank"
                        className="hover:text-primary p-2 transition"
                        aria-label="Twitter"
                    >
                        <SlSocialTwitter />
                    </Link>
                    <Link
                        href={"https://www.linkedin.com/in/carnaval"}
                        target="_blank"
                        className="hover:text-primary p-2 transition"
                        aria-label="LinkedIn"
                    >
                        <SlSocialLinkedin />
                    </Link>
                </div>
            </div>
            <p className="text-center p-4">
                {translation.copyRight} {" "}
                <Link
                    href={"https://github.com/Zeyaddayman"}
                    target="_blank"
                    className="text-primary font-semibold"
                >
                    {translation.developer}
                </Link>
            </p>
        </footer>
    )
}

export default Footer