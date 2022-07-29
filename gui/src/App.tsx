import { DraculusData, isDraculusData } from 'MainComponent/DraculusData';
import { SetupFunctions } from 'MainLayout/FunctionsContext';
import MainLayout from 'MainLayout/MainLayout';
import { useEffect, useState } from 'react';
import './App.css';
import { getFigureData, useWindowDimensions } from './figurl';

const urlSearchParams = new URLSearchParams(window.location.search)
const queryParams = Object.fromEntries(urlSearchParams.entries())

function App() {
  let [data, setData] = useState<DraculusData>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const {width, height} = useWindowDimensions()

  useEffect(() => {
    getFigureData().then((data: any) => {
      if (!isDraculusData(data)) {
        setErrorMessage(`Invalid figure data`)
        console.error('Invalid figure data', data)
        return
      }
      setData(data)
    }).catch(err => {
      setErrorMessage(`Error getting figure data`)
      console.error(`Error getting figure data`, err)
    })
  }, [])

  if (queryParams.debug) {
    return (
      <MainLayout
        width={width - 1}
        height={height - 1}
      />
    )
  }

  if (errorMessage) {
    return <div style={{color: 'red'}}>{errorMessage}</div>
  }

  if (!data) {
    return <div>Waiting for data</div>
  }

  return (
    <SetupFunctions data={data}>
      <MainLayout
        width={width - 1}
        height={height - 1}
      />
    </SetupFunctions>
    // <MainComponent
    //   data={data}
    //   width={width - 10}  // we don't want the scrollbar to appear even when the menu is opened
    //   height={height - 5} // we don't want the scrollbar to appear
    // />
  )
}

export default App;
