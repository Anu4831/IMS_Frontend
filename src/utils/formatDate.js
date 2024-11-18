const formatDate = (dateString) => {
    console.log("date", dateString);
    // dateString = '9-20-2024';

    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    //  const formattedDate = new Date().toLocaleDateString(undefined, options);

    return formattedDate;
};




export default formatDate;
