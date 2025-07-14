function ProfileForm() {
    return (
        <div className="border w-[60%] border-gray-300 rounded-md p-4">
            <h3 className="text-2xl font-bold mb-4">Profile</h3>
            <label htmlFor="name" className="block mb-2">Name</label>
            <input type="text" name="name" id="name" className="border border-gray-300 rounded-md mb-2 px-3 py-2 block w-full"/>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input type="text" name="email" className="border border-gray-300 rounded-md mb-2 px-3 py-2 block w-full"/>
            <label htmlFor="phone" className="block mb-2">Phone</label>
            <input type="phone" name="phone" id="phone" className="border border-gray-300 rounded-md mb-2 px-3 py-2 block w-full"/>
        </div>
    );
};

export default ProfileForm;
