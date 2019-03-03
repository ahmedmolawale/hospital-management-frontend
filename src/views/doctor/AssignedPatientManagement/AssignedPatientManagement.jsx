import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalTitle,
  ModalHeader,
  FormControl
} from "react-bootstrap";
import { connect } from "react-redux";
import { CardWithButton } from "components/CardWithButton/CardWithButton.jsx";
import ReportingArea from './ReportingArea.jsx'
import Button from 'elements/CustomButton/CustomButton.jsx';
import {
  fetchAssignedPatients,
  recordVitals,
  fetchDoctors,
  getInfoOnPatient,
  saveMedicalRecord
} from "./action.js";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import matchSorter from 'match-sorter'
import alertify from 'alertifyjs';

const Loading = require("react-loading-animation");
const currencyFormatter = require("currency-formatter");

class AssignedPatientManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingRecordVitals: false,
      errorMessage: "",
      showModal: false,
      isLoadingUpdate: false,
      isLoadingCreate: false,
      filtered: [],
      filterAll: '',
      isLoadingNurses: false,
      assignedPatients: null,
      doctor_id: '',
      doctors: [],
      patientInfo: null,
      complication: '',
      past_surgery: '',
      others: '',
      mode_birth: '',
      pregnancy_number: '',
      genetic_diabetics: true,
      selectedPatient: null,
      isLoadingCreateMedicalRecords:false,
      showReportingArea: false
  };
  this.filterAll = this.filterAll.bind(this);
     this.patients = [];
  }
  componentWillMount() {
    //dispatch an action to retrieve clients
    this.fetchAssignedPatients();

  }
  fetchDoctors(){
    this.props.fetchDoctors()
    .then(response => {
      const {
        payload:{status, data}
      } = response;
      console.log('Response is ', response)
      if (status === 200) {
        this.setState({isLoadingPatients: false, doctors: data})
      }else{
        doctors: null
      }
    }).catch(err => 
      {
        this.setState({
          isLoadingPatients: false,
          patients: null,
          errorMessage: "An error occurred."
        });
      })
  }
  fetchAssignedPatients(){
    const staffId = this.props.user.staff_id;
    this.setState({isLoadingPatients: true})
    this.props
      .fetchAssignedPatients(staffId)
      .then(response => {
        console.log('Response is', response);
        const {
          payload:{status, data}
        } = response;
        
        if (status === 200) {
          this.setState({isLoadingPatients: false, assignedPatients: data})
        }else{
          this.setState({
            isLoadingPatients: false,
            patients: null,
            errorMessage: "An error occurred fetching patients."
          });
        }
      }).catch(() => {
        this.setState({
          isLoadingPatients: false,
          patients: null,
          errorMessage: "An error occurred."
        });
      });
  }
  columnGeneratorAssignedPatients() {
    return [
        {
            Header: 'S/N',
            accessor: 'sn',
        },
        {
            Header: 'Patient Id',
            accessor: 'id',
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
          Header: 'Assigned on',
          accessor: 'createdAt',
        },
        {
            Header: 'Blood Pressure',
            accessor: 'blood_pressure',
        },
        {
            Header: 'Temperature',
            accessor: 'temperature',
        },
        {
          Header: 'Pulse',
          accessor: 'pulse',
        },
        {
          Header: 'Weight',
          accessor: 'weight',
        },
        {
            Header: 'Attend',
            Cell: ({row}) => (
                <div>
                    <button
                        className={"btn btn-primary"}
                        type="button"
                        onClick={() => this.handlePatientVisit(row._original)}>{'Attend to patient'}</button>
                </div>
            )
        },
        {
            Header: "",
            id: 'all',
            width: 0,
            resizable: false,
            sortable: false,
            Filter: () => { },
            filterMethod: (filter, rows) => {
              const result = matchSorter(rows, filter.value, {
                keys: [
                  "sn",
                  "name",
                  "id",
                  "createdAt",
                  "blood_pressure",
                  "temperature",
                  "pulse",
                  "weight"
                ], threshold: matchSorter.rankings.CONTAINS
              });
              return result;
            },
            filterAll: true,
          }
    ]
}
handlePatientVisit(patient){

  console.log('Taking for ', patient);
  this.setState({selectedPatient: patient})
  this.props.getInfoOnPatient(patient.id)
  .then(response => {
    console.log('Response is', response);
    const {
      payload:{status, data}
    } = response;
    if (status === 200) {
      this.setState({isGettingInfo: false, patientInfo: data, showReportingArea: true})
    }else if(response.payload.response.status === 404){
        this.setState({selectedPatient: patient, showModal:true});
    }else{
      this.setState({
        isGettingInfo: false,
        patientInfo: null
      });
    }
  }).catch(err => {
    this.setState({isGettingInfo: false})
    this.showAlert('Error', 'Unable to get patient info.\n Please try again.')
  });
 
}
open(){
  this.setState({showModal: true})
}
close(){
  this.setState({showModal: false})
}
showAlert(title, message) {
  alertify.alert(title, message, function () {
  });
}
showConfirmDialog(title, message) {
  alertify.confirm(title, message, () => {
      this.assignPatient()
  }, function () {
  }).set('labels', {ok: 'Yes', cancel: 'No'})
}
assignPatient(){
  const requestBody = {
    staff_id: this.state.selectedNurse.id,
    patient_id: this.state.selectedPatient.id,
  }
  this.setState({isLoadingNurses: true})
  this.props.assignPatient(requestBody)
  .then(response => {
    this.setState({isLoadingNurses: false})
    this.showAlert('Success', 'Patient has been assigned to nurse successfully.')
  }).catch(err => {
    this.setState({isLoadingNurses: false})
    this.showAlert('Error', 'Unable to assign patient to nurse at this time.\n Please try again.')
  })
}
generateAssignedPatientsData(patients) {
  return patients.map((patient, index) => {
      const { patient_id, first_name, last_name, assigned, phone_number, gender, address, createdAt} = patient;
      const data = assigned[assigned.length-1]
      const date = new Date(data.createdAt)
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      
      return ({
          sn: ++index,
          blood_pressure: data.blood_pressure,
          temperature: data.temprature,
          weight: data.weight,
          pulse: data.pulse,
          name: `${first_name} ${last_name}`,
          createdAt: `${dd}/${mm}/${yyyy}`,
          id: patient_id
      })
  })
}

onFilteredChange(filtered) {
  if (filtered.length > 1 && this.state.filterAll.length) {
    const filterAll = '';
    this.setState({ filtered: filtered.filter((item) => item.id !== 'all'), filterAll })
  }
  else
    this.setState({ filtered });
}
filterAll(e) {
  const { value } = e.target;
  const filterAll = value;
  const filtered = [{ id: 'all', value: filterAll }];
  this.setState({ filterAll, filtered });
}
onSubmit(e){
  e.preventDefault();
  console.log('Logged in staff is ', this.props.user);
  const {genetic_diabetics, others, pregnancy_number, complication, mode_birth, past_surgery}
   = this.state;
  let requestBody = {
      genetic_diabetics,
      others,
      pregnancy_number,
      complication,
      mode_birth,
      past_surgery,
      patient_id: this.state.selectedPatient.id,
      doctor_id:this.props.user.staff_id
  };
  console.log('Req', requestBody);
  this.setState({isLoadingCreateMedicalRecords: true});
      this.props.saveMedicalRecord(requestBody)
      .then(res => {
        console.log('Response is ', res);
        this.setState({isLoadingCreateMedicalRecords: false});
        if(res.payload.status === 201){
          this.showAlert('Success', `Medical records has been captured for patient.\n Proceed now.`)
        }else if(res.payload.response.status === 400){
          this.setState({isLoadingCreateMedicalRecords: false});
          this.showAlert('Error', 'An error occurred.')
        }
      }).catch(err => {
        this.setState({isLoadingCreateMedicalRecords: false});
        this.showAlert('Error', 'An error occurred.')
      })
  
}

  render() {
    
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            {
              !this.state.showReportingArea ?
              <Col md={12}>
                <CardWithButton
                  title="Assigned Patients"
                  category="All the patients assigned to you..."
                  ctTableFullWidth
                  ctTableResponsive
                  showButton={false}
                  onButtonClick={() => this.open()}
                  buttonName=""
                  content={
                    this.state.assignedPatients === null? (
                      <Loading isLoading={this.state.isLoadingPatients} />
                    ) : (
                      <div className='data-table-div'><br/>
                                Search: <input value={this.state.filterAll} onChange={this.filterAll} /><br/><br/>
                      <ReactTable
                          className={'center-align'}
                          data={this.generateAssignedPatientsData(this.state.assignedPatients)}
                          columns={this.columnGeneratorAssignedPatients()}
                          filtered = {this.state.filtered}
                          onFilteredChange={this.onFilteredChange.bind(this)}
                          defaultPageSize={5}
                          getTheadProps={(state, rowInfo, column) => {
                                            return {
                                                style: {
                                                    background: "#FFF",
                                                    color: "black",
                                                   
                                                }
                                            };
                        }}/>
                        </div>
                    )
                  }
                />
              </Col>
              :
              <ReportingArea details={this.state.selectedPatient} medicalRecord={this.state.patientInfo}
              patientVitals={this.state.selectedPatient} />
            }
          </Row>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <ModalHeader closeButton>
            <ModalTitle>
              <strong>Medical Record for first time patient</strong>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
          <Loading isLoading={this.state.isLoadingCreateMedicalRecords} />
            <div>
            <form onSubmit={this.onSubmit.bind(this)}>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Pregnancy Number< strong className = 'error-message'> *</strong></label >
              <input required type={'number'}
                onChange = {(e) => {this.setState({pregnancy_number: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Mode of Birth</label >
              <input
                onChange = {(e) => {this.setState({mode_birth: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Past Surgery</label >
              <input 
                onChange = {(e) => {this.setState({past_surgery: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Complication</label >
              <input 
                onChange = {(e) => {this.setState({complication: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {6}>
            <div>
            <label>Genetic Diabetics <strong className = 'error-message' > * </strong></label>
              <FormControl
                    componentClass="select"
                    placeholder="select"
                    onChange={(e) => this.setState({genetic_diabetics: e.target.value})}>     
                      <option value={true} key={0}>Yes</option>
                      <option value={false} key={1}>No</option>

                  </FormControl>

             </div>
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Others</label >
              <input 
                onChange = {(e) => {this.setState({others: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
              <Button bsStyle="info" fill type="submit" block>
                Record Medical Record
              </Button>
              <br/>
            </form>
            </div>
          </ModalBody>
          <Modal.Footer>
            <Button bsStyle="danger" fill onClick={this.close.bind(this)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </Grid>
        <div />
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
      user: state.user,
  };
}

export default connect(mapStateToProps, {
  fetchAssignedPatients,
  recordVitals,
  fetchDoctors,
  getInfoOnPatient,
  saveMedicalRecord
})(AssignedPatientManagement);
