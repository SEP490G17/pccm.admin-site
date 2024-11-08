import {Image} from "antd";
import {Grid, GridItem} from "@chakra-ui/react";

interface IProps {
    images: string[];
}

const ListImageComponent = ({images}: IProps) => {
    return (
        <>
            <Grid
                templateRows='repeat(2,1fr)'
                templateColumns={'repeat(24,1fr)'}
                className={'h-full'}
                gap={2}
                
            >
                <Image.PreviewGroup items={images}>

                    {
                        images.length <= 1 && (
                            <GridItem colSpan={24} rowSpan={2}>
                                <Image src={images[0]} loading={'lazy'} width={'100%'}
                                       height={'100%'} className={'rounded-lg'}/>
                            </GridItem>
                        )
                    }

                    {
                        images.length === 2 &&
                        images.map(img => (
                            <GridItem key={img} colSpan={12} rowSpan={2}>
                                <Image src={img} loading={'lazy'} className={'object-cover rounded-lg'}
                                       height={'100%'}/>
                            </GridItem>
                        ))
                    }

                    {
                        images.length >= 3 &&
                        (<>
                                <GridItem colSpan={16} rowSpan={2}>
                                    <Image src={images[0]} loading={'lazy'} width={'100%'}
                                           height={'100%'} className={'rounded-lg'}/>
                                </GridItem>
                                <GridItem colSpan={8} rowSpan={1}>
                                    <Image src={images[1]} loading={'lazy'}
                                           width={'100%'} height={'100%'}
                                           className={'rounded-lg flex-1 object-cover h-full'}
                                    />


                                </GridItem>
                                <GridItem colSpan={8} rowSpan={1}>
                                    <div className={'relative p-0 m-0 h-full'}>
                                        <Image
                                            id="image-group-2"
                                            src={images[2]}
                                            width={"100%"}
                                            height={'100%'}
                                            className="rounded-lg flex-1 object-cover"
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "#fff",
                                                fontSize: 18,
                                            }}
                                            className="rounded-lg cursor-pointer"
                                            onClick={() => {
                                                document.getElementById("image-group-2")?.click();
                                            }}
                                        >
                                            Xem thêm {images.length - 3} ảnh
                                        </div>
                                    </div>
                                </GridItem>
                            </>
                        )
                    }
                </Image.PreviewGroup>
            </Grid>

        </>
    );
};

export default ListImageComponent;