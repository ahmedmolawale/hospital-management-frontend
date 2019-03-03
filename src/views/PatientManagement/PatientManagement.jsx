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
  fetchFreePatients,
  fetchAllPatients,
  createPatient,
  fetchAllNurses,
  assignPatient
} from "./action.js";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import matchSorter from 'match-sorter'
import alertify from 'alertifyjs';

const Loading = require("react-loading-animation");
const currencyFormatter = require("currency-formatter");

class PatientManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
   
      selectedInstitutionAdmin:null,
      errorMessage: "",
      showModal: false,
      isLoadingInstitutionAdmins: true,
      isLoadingUpdate: false,
      isLoadingCreate: false,
      filtered: [],
      filterAll: '',
      imageFile: null,
      institutions: [],
      admin: null,
      name:'',
      bankCode:'',
      firstName:'',
      surname:'',
      email:'',
      username:'',
      otherName: '',
      selectedBankCode: null,
      resetingPassword: false,
      isLoadingPatients: true,
      patients:[],
      selectedPatient: null,
      isLoadingNurses: false,
      isLoadingCreatePatient: false,
      first_name: '',
      last_name: '',
      dob:'',
      occupation:'',
      phone_number:'',
      address:'',
      next_of_kin_address:'',
      next_of_kin_name:'',
      next_of_kin_occupation:'',
      next_of_kin_phone_number:'',
      next_of_kin_relationship: '',
      selectedNurse: null

  };
  this.filterAll = this.filterAll.bind(this);
     this.patients = [];
  }
  componentWillMount() {
    //dispatch an action to retrieve clients
    this.fetchAllPatients();
  }
  fetchAllPatients(){
    this.props
      .fetchAllPatients()
      .then(response => {
        console.log('Response is', response);
        const {
          payload:{status, data}
        } = response;
        
        if (status === 200) {
          this.setState({isLoadingPatients: false, patients: data})
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
  columnGeneratorPatients() {
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
            Header: 'Assign',
            Cell: ({row}) => (
                <div>
                    <button
                        className={"btn btn-primary"}
                        type="button"
                        onClick={() => this.handleAssignPatient(row._original)}>{row._original.available === true ? 'Send to Nurse' : 'With a Nurse'}</button>
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
handleAssignPatient(patient){
 this.setState({selectedPatient: patient});
 if(!patient.available) return this.showAlert('Assigned', 'Patient already with a Nurse.')
 this.showAvailableNurses()
}
open(){
  this.setState({showModal: true})
}
close(){
  this.setState({showModal: false})
}
open2(){
  this.setState({showModal2: true})
}
close2(){
  this.setState({showModal2: false})
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
showAvailableNurses(){
  this.setState({isLoadingNurses: true})
  this.props.fetchAllNurses()
  .then(response => {
    this.setState({isLoadingNurses: false})
      const {
        status,
        data
      } = response.payload;
      this.setState({nurses: data, showModal2: true})
  }).catch(err => {
    this.setState({isLoadingNurses: false})
    console.log('Error fetching nurses')}
  );
}
generatePatientsData(patients) {
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
columnGeneratorNurse(){
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
                        onClick={() => this.handleAssignNurse(row._original)}>{'Choose'}</button>
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
handleAssignNurse(nurse){
  this.setState({selectedNurse: nurse})
  this.showConfirmDialog('Confirmation', `Are you sure you want to assign patient ${this.state.selectedPatient.id} to nurse ${nurse.id} ? `)
}
generateNurseData(nurses) {
  return nurses.map((nurse, index) => {
      const { staff_id, first_name, last_name, username, phone_number, gender, address, createdAt} = nurse;
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
  const {first_name, last_name, dob, phone_number, address, occupation,
  next_of_kin_address, next_of_kin_occupation, next_of_kin_phone_number, next_of_kin_name, next_of_kin_relationship}
   = this.state;
  let requestBody = {
    first_name,
    last_name,
    dob,
    phone_number,
    address,
    occupation,
    next_of_kin_address,
    next_of_kin_name,
    next_of_kin_occupation,
    next_of_kin_phone_number,
    next_of_kin_relationship
  };
  this.setState({isLoadingCreatePatient: true});
      this.props.createPatient(requestBody)
      .then(res => {
        this.setState({isLoadingCreate: false});
        if(res.payload.status === 201){
          this.setState({isLoadingCreatePatient: false, patients: null, patientId: res.payload.data.patient_id});
          this.showAlert('Success', `Patient has been created successfully.\nPatient ID is \n${res.payload.data.patient_id}`)
          this.fetchAllPatients();
        }else if(res.payload.response.status === 400){
          this.setState({isLoadingCreatePatient: false});
          this.showAlert('Error', 'An error occurred.')
        }
      }).catch(err => {
        this.setState({isLoadingCreatePatient: false});
        this.showAlert('Error', 'An error occurred.')
      })
  
}

  render() {
    return (
      <div className="content">
        <Loading isLoading={this.state.isLoadingNurses} />
        <Grid fluid>
          <Row>
            {
              <Col md={12}>
                <CardWithButton
                  title="Patients"
                  category="All the patients on the platform"
                  ctTableFullWidth
                  ctTableResponsive
                  showButton={true}
                  onButtonClick={() => this.open()}
                  buttonName="Add New Patient"
                  content={
                    !this.state.patients ? (
                      <Loading isLoading={this.state.isLoadingPatients} />
                    ) : (
                      <div className='data-table-div'><br/>
                                Search: <input value={this.state.filterAll} onChange={this.filterAll} /><br/><br/>
                      <Loading isLoading={this.state.resetingPassword} />
                      <ReactTable
                          className={'center-align'}
                          data={this.generatePatientsData(this.state.patients)}
                          columns={this.columnGeneratorPatients()}
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
              <strong>Create Patient</strong>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
          <Loading isLoading={this.state.isLoadingCreatePatient} />
            <div>
            <h5 className={"centre-message"}>{this.state.message}</h5>
            <h5 className="error-message">{this.state.errorMessage}</h5>
            <form onSubmit={this.onSubmit.bind(this)}>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>First Name< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'First Name'
                onChange = {(e) => {this.setState({first_name: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Last Name< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Last name'
                onChange = {(e) => {this.setState({last_name: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Date of Birth< strong className = 'error-message'> *</strong></label >
              <input required type={'date'} step={'1'} placeholder = '24'
                onChange = {(e) => {this.setState({dob: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Phone number< strong className = 'error-message'> *</strong></label >
              <input required type={'number'} placeholder = '07011223344'
                onChange = {(e) => {this.setState({phone_number: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Address< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Address'
                onChange = {(e) => {this.setState({address: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Occupation< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Occupation'
                onChange = {(e) => {this.setState({occupation: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <h5 className='margin-left'>Next of Kin Information</h5>
              <hr/>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Name< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Adiva'
                onChange = {(e) => {this.setState({next_of_kin_name: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
            <div className = {`form-group in-line`} >
            <label>Phone number< strong className = 'error-message'> *</strong></label >
            <input required type={'number'} placeholder = '07011223344'
              onChange = {(e) => {this.setState({next_of_kin_phone_number: e.target.value})}} className = "form-control"/>
            </div> 
          </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Relationship< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Relationship'
                onChange = {(e) => {this.setState({next_of_kin_relationship: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
            <div className = {`form-group in-line`} >
            <label>Occupation< strong className = 'error-message'> *</strong></label >
            <input required placeholder = 'Occupation'
              onChange = {(e) => {this.setState({next_of_kin_occupation: e.target.value})}} className = "form-control"/>
            </div> 
          </Col>
            </Row>
            <Row>
            <Col md = {12}>
              <div className = {`form-group in-line`} >
              <label>Address< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Next of kin address'
                onChange = {(e) => {this.setState({next_of_kin_address: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
              <Button bsStyle="info" fill type="submit" block>
                Create Patient
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
        <Modal show={this.state.showModal2} onHide={this.close2.bind(this)}>
          <ModalHeader closeButton>
            <ModalTitle>
              <strong>Choose a Nurse</strong>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
          <Loading isLoading={this.state.isLoadingNurses} />
          {this.state.nurses ? 
            <div>
                      <ReactTable
                          className={'center-align'}
                          data={this.generateNurseData(this.state.nurses)}
                          columns={this.columnGeneratorNurse()}
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
            <Button bsStyle="danger" fill onClick={this.close2.bind(this)}>
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

// function mapStateToProps(state) {
//   return {
//     token: state.adminToken.data.access_token
//   };
// }

export default connect(null, {
fetchAllPatients,
fetchFreePatients,
createPatient,
fetchAllNurses,
assignPatient
})(PatientManagement);
