import { render, screen, fireEvent, waitFor, wait } from '@testing-library/react';
import App from './App';
import URLInfo from './url_info';

test('No of times used should be 100',() => {
	const data = {
		url: 'http://google.com',
		short_url: 'http://test/abcd',
		used: 100,
		created_at: Date.now()
	}
	render(<URLInfo data={data}/>)
	const usedElement = screen.getByText(data.used)
	expect(usedElement).toBeInTheDocument()
})



test('Short url should point to  http://test/abcd',() => {
	const data = {
		url: 'http://google.com',
		short_url: 'http://test/abcd',
		used: 100,
		created_at: Date.now()
	}
	render(<URLInfo data={data}/>)
	const shortUrl = screen.getByText(`Short URL : ${data.short_url}`)
	expect(shortUrl).toBeInTheDocument()
})


test('Short url should be the target link',() => {
	const data = {
		url: 'http://google.com',
		short_url: 'http://test/abcd',
		used: 100,
		created_at: Date.now()
	}
	render(<URLInfo data={data}/>)
	expect(screen.getByText(data.url).closest('a')).toHaveAttribute('href', data.short_url)

})

test('Invalid URL input should shown an alert',() =>{
	render(<App/>)
	const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
	fireEvent.click(screen.getByText('Short it'))
	expect(alertMock).toHaveBeenCalledTimes(1)
})

function setupFetchStub(data) {
	return function fetchStub(_url) {
	  return new Promise((resolve) => {
		resolve({
		  json: () =>
			Promise.resolve({
			  data,
			}),
			status: 200
		})
	  })
	}
  }

it('doesnt really fetch', async () => {
	const url = 'https://www.pickfu.com'
	const data = {
		url: url,
		short_url: 'http://test.com/123',
		used:0,
		created_at: Date.now(),
		_id: Math.random().toString(16).slice(2)
	}
	jest.spyOn(global, "fetch").mockImplementation(setupFetchStub(data))
  
	const res = await fetch('anyUrl')
	const json = await res.json()
	expect(json).toEqual({ data: data })
  
	global.fetch.mockClear()
  })
  


test('Valid URL should be appended to the list',async() =>{
	const url = 'https://www.pickfu.com'
	const data = {
		url: url,
		short_url: 'http://test.com/123',
		used:0,
		created_at: Date.now(),
		_id: Math.random().toString(16).slice(2)
	}
	var mockAPI = jest.spyOn(global,'fetch').mockImplementation(setupFetchStub([data])); 
	render(<App/>)
	await waitFor(() => expect(mockAPI).toHaveBeenCalledTimes(1))
	data.url = 'https://www.pickfu.com/products/open-ended-polls'
	data.short_url = 'http://test.com/456'
	data._id = Math.random().toString(16).slice(2)
	mockAPI = jest.spyOn(global,'fetch').mockImplementation(setupFetchStub(data)); 
	const urlInput = screen.getByPlaceholderText('Enter your URL here')
	fireEvent.change(urlInput,{target:{value:url}})
	await waitFor(() => expect(urlInput).toHaveValue(url))
	fireEvent.click(screen.getByText('Short it'))
	await waitFor(() => expect(mockAPI).toHaveBeenCalledTimes(2))
	await waitFor(() => expect(screen.getByText(data.url)).toBeInTheDocument())
	
	await waitFor(() =>
		expect(screen.getByText(data.url).closest('a')).toHaveAttribute('href', data.short_url)
	);
	global.fetch.mockClear()
})
