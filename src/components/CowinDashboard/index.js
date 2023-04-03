import {Component} from 'react'
import Loader from 'react-loader-spinner'
// import Cookies from 'js-cookie'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const componentValues = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CowinDashBoard extends Component {
  state = {
    myData: {},
    displayStatus: componentValues.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({displayStatus: componentValues.pending})
    // const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (response.ok) {
      const convertedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }

      //   const a = data.last_7_days_vaccination.map(each => ({
      //     vaccineDate: each.vaccine_date,
      //     dose1: each.dose_1,
      //     dose2: each.dose_2,
      //   }))
      //   console.log(a)
      //   const b = data.vaccination_by_age.map(each => ({
      //     age: each.age,
      //     count: each.count,
      //   }))
      //   console.log(b)
      //   const c = data.vaccination_by_gender.map(each => ({
      //     count: each.count,
      //     gender: each.gender,
      //   }))

      this.setState({
        myData: convertedData,
        displayStatus: componentValues.success,
      })
    } else {
      this.setState({displayStatus: componentValues.failure})
    }
  }

  onClickButton = () => {
    const {vaccinationByGender} = this.state
    console.log(vaccinationByGender)
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-view-text">Something went wrong</h1>
    </div>
  )

  switchCaseCheck = () => {
    const {displayStatus} = this.state
    switch (displayStatus) {
      case componentValues.success:
        return this.renderCharts()
      case componentValues.pending:
        return this.loadingView()
      case componentValues.failure:
        return this.failureView()
      default:
        return null
    }
  }

  renderCharts = () => {
    const {myData} = this.state
    const {last7DaysVaccination, vaccinationByAge, vaccinationByGender} = myData

    return (
      <>
        <VaccinationCoverage last7DaysVaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  render() {
    return (
      <div className="bg-container">
        <div className="logo-container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="logo-name">Co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        {this.switchCaseCheck()}
      </div>
    )
  }
}
export default CowinDashBoard
