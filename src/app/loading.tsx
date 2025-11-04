import Image from "next/image"

const Loading = () => {
    return (
        <main>
            <div className="container">
                <div className="flex w-full h-[70vh] justify-center items-center">
                    <Image
                        src={"/images/loading.svg"}
                        alt="loading"
                        width={300}
                        height={255}
                    />
                </div>
            </div>
        </main>
    )
}

export default Loading