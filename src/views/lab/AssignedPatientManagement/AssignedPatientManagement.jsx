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
import {
  fetchAssignedPatients,
  recordVitals,
  fetchDoctors,
  recordResult
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
      isLoadingRecordLabResult: false,
      doctor_id: '',
      doctors: [],
      red_blood_cell: '',
      white_blood_cell: '',
      heamoglobin: '',
      urinalysis: '',
      glucose: ''
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
            Header: 'Date of birth',
            accessor: 'dob',
        },
       
        {
            Header: 'Phone Number',
            accessor: 'phone_number',
        },
        {
            Header: 'Address',
            accessor: 'address',
        },
        {
          Header: 'Created on',
          accessor: 'createdAt',
        },
        {
            Header: 'Analysis',
            Cell: ({row}) => (
                <div>
                    <button
                        className={"btn btn-primary"}
                        type="button"
                        onClick={() => this.handleRecordResult(row._original)}>{'Record Result'}</button>
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
                  "dob",
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
handleRecordResult(patient){
  console.log('Taking vitals for ', patient);
 this.setState({selectedPatient: patient, showModal:true});
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
      const { patient_id, first_name, last_name, dob, phone_number, gender, address, available, createdAt} = patient;
      const date = new Date(createdAt)
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      
      return ({
          sn: ++index,
          dob,
          phone_number,
          gender,
          address,
          name: `${first_name} ${last_name}`,
          createdAt: `${dd}/${mm}/${yyyy}`,
          id: patient_id,
          available
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
  const requestBody = {
    patient_id: this.state.selectedPatient.id,
    lab_id: this.props.user.staff_id,
    white_blood_cell: this.state.white_blood_cell,
    red_blood_cell: this.state.red_blood_cell,
    urinalysis: this.state.urinalysis,
    heamoglobin: this.state.heamoglobin,
    glucose: this.state.glucose
  }
  console.log('Request body ', requestBody);
  this.setState({isLoadingRecordLabResult: true});
  this.props.recordResult(requestBody)
  .then(response => {
   this.setState({isLoadingRecordLabResult: false});
     if(response.payload.status === 201){
       console.log('Success')
       this.showAlert('Success', 'Patient lab result recorded.');
       this.fetchAssignedPatients()
     }else{
      console.log('Failed 1')
       this.showAlert('Error', 'Patient lab result could not be saved.');
     }
  }).catch(err => {
    console.log('Failed 2')
   this.setState({isLoadingRecordLabResult: false});
   this.showAlert('Error', 'Unable to save patient lab result.');
  })
  
}

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            {
              <Col md={12}>
                <CardWithButton
                  title="Patients"
                  category="All the patients waiting for lab test"
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
            }
          </Row>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <ModalHeader closeButton>
            <ModalTitle>
              <strong>Record Lab Result</strong>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
          <Loading isLoading={this.state.isLoadingRecordLabResult} />
            <div>
            <form onSubmit={this.onSubmit.bind(this)}>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>White Blood Cell< strong className = 'error-message'> *</strong></label >
              <input required
                onChange = {(e) => {this.setState({white_blood_cell: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Red Blood Cell< strong className = 'error-message'> *</strong></label >
              <input required
                onChange = {(e) => {this.setState({red_blood_cell: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Glucose<strong className = 'error-message'> *</strong></label >
              <input required
                onChange = {(e) => {this.setState({glucose: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Heamoglobin< strong className = 'error-message'> *</strong></label >
              <input required
                onChange = {(e) => {this.setState({heamoglobin: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Urinalysis< strong className = 'error-message'> *</strong></label >
              <input required
                onChange = {(e) => {this.setState({urinalysis: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            
              <Button bsStyle="info" fill type="submit" block>
                Record Lab Result
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
  recordResult
})(AssignedPatientManagement);
