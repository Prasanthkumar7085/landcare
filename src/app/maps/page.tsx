import Maps from "@/components/Maps";
import { Suspense } from "react";

const MapsPage = () => {

    return (
        <div>
            <Suspense>
                <Maps />
            </Suspense>
        </div>
    );
}
export default MapsPage;