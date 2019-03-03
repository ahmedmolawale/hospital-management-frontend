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
import Button from 'elements/CustomButton/CustomButton.jsx';
import AssignedPatientManagement from './AssignedPatientManagement'
import {
  fetchAssignedPatients,
  recordVitals,
  fetchDoctors,
  getInfoOnPatient,
  saveMedicalRecord,
  fetchLabAttendants,
  assignPatientToLab,
  loadLabResults
} from "./action.js";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import matchSorter from 'match-sorter'
import alertify from 'alertifyjs';

const Loading = require("react-loading-animation");
const currencyFormatter = require("currency-formatter");

class ReportingArea extends Component {
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
      showPatients: false,
      labs:[],
      isLoadingLabs: false,
      selectedLabAttendant:null,
      isLoadingAssignLab: false,
      isLoadingLabResult: false,
      labResults:null
  };
  this.filterAll = this.filterAll.bind(this);
     this.patients = [];
  }
  componentWillMount() {
    //dispatch an action to retrieve clients
    this.getLabResult(this.props.details.id);
  }

  getLabResult(patientId){
    this.setState({isLoadingLabResult: true})
    this.props.loadLabResults(patientId)
    .then(response => {
      console.log('Response ', response)
        this.setState({isLoadingLabResult: false});
        if(response.payload.status === 200){
          this.setState({labResults: response.payload.data})
        }else{
          this.showAlert('Error', 'Error getting lab result.')
        }
    }).catch(err => {
      this.setState({isLoadingLabResult: false});
      this.showAlert('Error', 'Error getting lab result.')
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
      this.setState({isGettingInfo: false, patientInfo: data})
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
  this.assignPatient()
}
assignPatient(){

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
sendToLab(){
  // this.showConfirmDialog('Confirmation', 'Are you sure you want to send the patient to the lab ?');
  this.props.fetchLabAttendants()
  .then(response => {
    const {
      status,
      data
    } = response.payload;
    this.setState({labs: data, showModal: true})
  }).catch(err => {
    this.showAlert('Error', 'An error occurred fetching lab attendants')
  })
}
columnGeneratorLab(){
  return [
        {
            Header: 'Staff Id',
            accessor: 'id',
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Gender',
            accessor: 'gender',
        },
        {
            Header: 'Phone Number',
            accessor: 'phone_number',
        },
        {
            Header: 'Assign',
            Cell: ({row}) => (
                <div>
                    <button
                        className={"btn btn-primary"}
                        type="button"
                        onClick={() => this.handleAssignLab(row._original)}>{'Choose'}</button>
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
                  "gender",
                  "phone_number",
                  "address",
                  "createdAt"
                ], threshold: matchSorter.rankings.CONTAINS
              });
              return result;
            },
            filterAll: true,
          }
    ] 
}
handleAssignLab(labAttendant){
  const requestBody = {
    staff_id: labAttendant.id,
    patient_id: this.props.details.id,
  }
  console.log('Request body is ', requestBody)
  this.setState({isLoadingAssignLab: true})
  this.props.assignPatientToLab(requestBody)
  .then(response => {
    this.setState({isLoadingAssignLab: false})
    this.showAlert('Success', 'Patient has been assigned to lab attendant successfully.')
  }).catch(err => {
    this.setState({isLoadingAssignLab: false})
    this.showAlert('Error', 'Unable to assign patient to lab attendant at this time.\n Please try again.')
  })
}
generateLabData(labs) {
  return labs.map((lab, index) => {
      const { staff_id, first_name, last_name, username, phone_number, gender, address, createdAt} = lab;
      const date = new Date(createdAt)
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      
      return ({
          sn: ++index,
          username,
          phone_number,
          gender,
          address,
          name: `${first_name} ${last_name}`,
          createdAt: `${dd}/${mm}/${yyyy}`,
          id: staff_id,
      })
  })
}
onDiagonise(){
  console.log('Diagonising patient...')
  this.showAlert('Predict', 'Predict diagnosis')
}

onTreatment(){
  console.log('Treat patient...');
  this.showAlert('Predict', 'Predict Treatment')
}

  render() {
    const {
        pregnancy_number,
        genetic_diabetics,
        mode_birth,
        complication,
        others,
        past_surgery
    } = this.props.medicalRecord
    const {
      blood_pressure,
      temperature,
      weight,
      pulse
    } = this.props.patientVitals

    let labResult = null;
    if(this.state.labResults){
      labResult = this.state.labResults[this.state.labResults.length-1]
      console.log('Res', labResult)
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            {
              !this.state.showPatients ?  
              <Col md={12}>
                <CardWithButton
                  title="Reporting Area"
                  category=""
                  ctTableFullWidth
                  ctTableResponsive
                  showButton={true}
                  onButtonClick={() => this.setState({showPatients: true})}
                  buttonName="Back to patients"
                  content={
                      <div>
                        <Row>
                        <Col md= {6}>
                          <Row>
                        <h4>Medical Record</h4>
                        <hr/>
                        <Row>
                          <Col md={6}>
                          <label>Pregnancy Number: {pregnancy_number}</label>
                        </Col>
                        <Col md={6}>
                          <label>Genetic Diabetics: {genetic_diabetics ? 'Yes' : 'No'}</label>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={6}>
                          <label>Mode of Birth: {mode_birth}</label>
                        </Col>
                        <Col md={6}>
                          <label>Complication: {complication}</label>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={6}>
                          <label>Past Surgery: {past_surgery}</label>
                        </Col>
                        <Col md={6}>
                          <label>Others: {others}</label>
                        </Col>
                        </Row>
                        </Row>
                        </Col>
                        <Col md= {1}>
                        </Col>
                        <Col md= {5}>
                          <Row>
                        <h4>Recent Vitals from Nurse</h4>
                          <hr/>
                        <Row>
                          <Col md={6}>
                          <label>Blood Pressure: {blood_pressure}</label>
                        </Col>
                        <Col md={6}>
                          <label>Temperature: {temperature}</label>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={6}>
                          <label>Weight: {weight}</label>
                        </Col>
                        <Col md={6}>
                          <label>Pulse: {pulse}</label>
                        </Col>
                        </Row>
                        </Row>
                        </Col>
                        </Row>
                        <Row>
                        <Col md= {6}>
                          <Row>
                        <h4>Last Lab result</h4>
                        <Button bsStyle="success" fill onClick={this.sendToLab.bind(this)}>
                                   Send to Lab
                        </Button>
                        <hr/>
                        <Loading isLoading={this.state.isLoadingLabResult}/>
                        {
                          labResult !== null ? 
                        <div>
                        <Row>
                          <Col md={6}>
                          <label>White Blood Cell: {labResult.white_blood_cell}</label>
                        </Col>
                        <Col md={6}>
                          <label>Red Blood Cell: {labResult.red_blood_cell}</label>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={6}>
                          <label>Glucose: {labResult.glucose}</label>
                        </Col>
                        <Col md={6}>
                          <label>Urinalysis: {labResult.urinalysis}</label>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={6}>
                          <label>Heamoglobin: {labResult.heamoglobin}</label>
                        </Col>
                        </Row>
                        </div>
                        :''
                        }
                        </Row>
                        </Col>
                        
                        </Row>
                        <br/>
                        <Row>
                          COMPLAINT SECTION
                          <hr/>
                          <Col md = {10}>
                          <div className = {`form-group in-line`} >
                          <label className={'label-black-color'}>Complaints (Seperate complaints with a comma)</label >
                          <textarea
                            onChange = {(e) => {this.setState({complaint: e.target.value})}} className = "form-control"/>
                          </div>
                          </Col>
                          </Row>
                          <Row>
                            <Col md={5}>
                              <Button bsStyle="danger" pullRight fill onClick={this.onDiagonise.bind(this)}>
                                Predict Diagonise
                              </Button>
                            </Col>
                            <Col md={2}>
                              <Button bsStyle="primary" fill onClick={this.onTreatment.bind(this)}>
                                Predict Treatment
                              </Button>
                            </Col>

                          </Row> 
                        
                   </div>
                  }
                />
              </Col>
              : 
              <AssignedPatientManagement/>
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
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <ModalHeader closeButton>
            <ModalTitle>
              <strong>Choose a Lab attendant</strong>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
          <Loading isLoading={this.state.isLoadingLabs} />
          {this.state.labs ? 
            <div>
                      <ReactTable
                          className={'center-align'}
                          data={this.generateLabData(this.state.labs)}
                          columns={this.columnGeneratorLab()}
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
            :''}
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
  loadLabResults,
  saveMedicalRecord,
  fetchLabAttendants,
  assignPatientToLab
})(ReportingArea);
