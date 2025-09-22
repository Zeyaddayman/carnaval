const Heading = ({ title, subTitle }: { title: string, subTitle: string }) => {
    return (
        <div className="text-center mb-8">
            <h2 className="text-foreground text-2xl md:text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subTitle}</p>
        </div>
    )
}

export default Heading