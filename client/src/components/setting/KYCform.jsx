import IDimage from "../../asset/Depth 6, Frame 1 (3).png";
import selfieimage from "../../asset/Depth 6, Frame 1 (4).png";
import Button from "../comman/Button"
function KYCform() {
    return (
        <div className="max-w-3xl mx-auto p-6 mt-10 ml-0 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">KYC Verification</h1>

            {/* National ID Section */}
            <div className="flex  md:flex-row items-center gap-6 mb-10">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">National ID</h3>
                    <p className="text-sm text-gray-500 mb-3">Upload a clear image of your National ID</p>
                    <label htmlFor="idUpload" className="block text-gray-400 font-medium mb-1">Upload</label>
                    <input
                        type="file"
                        id="idUpload"
                        className="w-[85%] border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="flex-1">
                    <img src={IDimage} alt="ID preview" className="w-full rounded-md border border-gray-200 shadow-sm" />
                </div>
            </div>

            {/* Selfie Section */}
            <div className="flex  md:flex-row items-center gap-6">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Selfie</h3>
                    <p className="text-sm text-gray-500 mb-3">Upload a clear selfie of yourself</p>
                    <label htmlFor="selfieUpload" className="block text-gray-400 font-medium mb-1">Upload</label>
                    <input
                        type="file"
                        id="selfieUpload"
                        className="w-[85%] border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="flex-1">
                    <img src={selfieimage} alt="Selfie preview" className="w-full rounded-md border border-gray-200 shadow-sm" />
                </div>
            </div>
            <Button>Submit</Button>
            <h1 className="text-[20px] mt-10"><span className="text-gray-400">STATUS :</span> pending..</h1>
        </div>
        
    );
}

export default KYCform;
