import { Product } from "@/generated/prisma";

interface IProps {
    rating: Product["rating"]
    color?: string
    size?: "sm" | "lg"
}

const RatingStars = ({ rating, color = "#e6b800", size = "sm" }: IProps) => {

    const emptyStarsCount = 5 - Math.ceil(rating)

    const ratingString = String(rating)

    let int
    let float

    if (ratingString.includes(".")) {
        [ int, float ] = ratingString.split(".")
    } else {
        int = ratingString
        float = undefined
    }

    const sizes = {
        "sm": "22px",
        "lg": "30px"
    }

    const starSize = sizes[size]

    const Star = ({ fillPercentage }: { fillPercentage: number }) =>  {
        return (
            <svg width={starSize} height={starSize} viewBox="0 0 100 100">
                <defs>
                    <linearGradient id={`star-gradient-${fillPercentage}`} x1="0" x2="1" y1="0" y2="0">
                        <stop offset={`${fillPercentage}%`} stopColor={color} />
                        <stop offset={`${fillPercentage}%`} stopColor="transparent" />
                    </linearGradient>
                </defs>
                <polygon 
                    points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" 
                    fill={`url(#star-gradient-${fillPercentage}`}
                    stroke={color}
                    strokeWidth="2"
                />
            </svg>
        )
    }

    return (
        <div className="flex gap-1">
            {Array.from({ length: Number(int) }, (_, i) => <Star key={i} fillPercentage={100} />)}
            {float && <Star fillPercentage={Number(float)} />}
            {Array.from({ length: emptyStarsCount }, (_, i) => <Star key={i} fillPercentage={0} />)}
        </div>
    )
}

export default RatingStars;