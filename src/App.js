import './App.css';
import {useState,useEffect} from 'react'
import URLInfo from './url_info'

function App() {
	const [currentTabIndex, setcurrentTabIndex] = useState(0)
	const [urlInput, seturlInput] = useState('')
	const [urls, setUrls] = useState([])

	// var app_url = 'http://localhost:3000'
	var app_url = 'https://urlshortener-pickfu.herokuapp.com'

	useEffect( () =>  {
		fetchData();
	}, [])

	const urlValidator = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

	const getTabClasses = (tabId) => {
		return `block relative px-4 py-1 leading-6 sm:text-md font-semibold focus:outline-none transition-colors duration-300 bg-white  mr-5 ${currentTabIndex === tabId ? 'text-gray-900' : ' text-gray-400'}`
	}

	const  fetchData = async(top) => {
		const response = await fetch(!top ? `${app_url}/all` : `${app_url}/top`)
		if (response.status === 200){
			const res = await response.json();
			setUrls(res.data)
		}
	}

	const handleSubmit = async() => {
		const is_valid = urlValidator.test(urlInput)
		if (!is_valid){
			alert('Invalid URL, please try again');
			return;
		}

		const response = await fetch(app_url,{
			method:'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({
				url: urlInput
			})
		})

		if (response.status === 200){
			const res = await response.json();
			if (!urls.find(x=>x._id === res.data._id)){
				res.data.newly_added = true
				setUrls([res.data,...urls]);
			}
			seturlInput('')
		}else{
			alert('Problem shortening the URL')
		}

	}



	return (
		<div className="m-auto bg-gray-50 container">
			<h1 className="text-7xl text-center font-bold"> Great Url shortener</h1>
			<div className="pt-5 flex m-auto textInput justify-center">
			<input type="text" className=" border border-purple-700 flex-auto  pl-10" placeholder="Enter your URL here" value={urlInput} onChange={(e) => seturlInput(e.target.value)} />
			<button type="button" className="ml-5 bg-purple-200 text-purple-700 text-base font-semibold px-6 py-2 rounded-lg flex-none" onClick={handleSubmit}>Short it</button>
			</div>

			<div className="flex mt-5 p-5">
			<button type="button" className={getTabClasses(0)} onClick={()=>{
				setcurrentTabIndex(0)
				fetchData()
			}}>All URL's</button>
			<button type="button" className={getTabClasses(1)} onClick={()=>{
				setcurrentTabIndex(1)
				fetchData('top')
			}}>Top 100 URL's</button>
			</div>

			<div className="flex-col mt-5 p-5">
				{
					urls.map(data => {
						return <URLInfo data={data} key={data._id}></URLInfo>
					})
				}
			</div>
			
		</div>
	);
}

export default App;
