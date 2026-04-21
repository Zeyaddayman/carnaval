const OutOfStock = ({ text }: { text: string }) => {
    return (
        <div className="bg-destructive/70 text-destructive-foreground text-sm text-center font-semibold p-3 rounded-full">
            {text}
        </div>
    )
}

export default OutOfStock