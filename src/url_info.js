const URLInfo = ({data}) => {
    return <div className={`flex ${data.newly_added ? 'bg-yellow-100' : ''}`}>
                 <div className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center  bg-purple-200 text-purple-700 uppercase used">
                    {data.used}
                 </div>
                <div className="flex-col p-3 flex-auto">
                    <div className="header">
                       <a href={data.short_url}>
                         <h4 className="text-xl font-semibold">{data.url}</h4>
                       </a>
                    </div>
                    <div className="text-sm">
                        <a href={data.short_url}>Short URL : {data.short_url}</a>
                    </div>
                    <small className="text-xs">Created At: {new Date(data.created_at).toLocaleDateString('en-US')}</small>
                </div>
            </div>
}

export default URLInfo