const SectionHeading = ({ title, subTitle }: { title: string, subTitle: string }) => {
    return (
        <div className="text-center">
            <h2 className="text-foreground text-2xl lg:text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-8">{subTitle}</p>
        </div>
    )
}

export default SectionHeading