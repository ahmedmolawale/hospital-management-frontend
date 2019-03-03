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
  fetchAllNurses,
  createNurse
} from "./action.js";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import matchSorter from 'match-sorter'
import alertify from 'alertifyjs';

const Loading = require("react-loading-animation");
const currencyFormatter = require("currency-formatter");

class NurseManagement extends Component {
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
      gender: '',
      address:'',
      email_address: '',
      nationality:'',
      state_of_origin:'',
      next_of_kin_address:'',
      next_of_kin_name:'',
      next_of_kin_occupation:'',
      next_of_kin_phone_number:'',
      next_of_kin_relationship: '',
      isLoadingCreateNurse: false

  };
  this.filterAll = this.filterAll.bind(this);
     this.patients = [];
  }
  componentWillMount() {
    //dispatch an action to retrieve clients
    this.fetchAllNurses();
  }
  fetchAllNurses(){
    this.props
      .fetchAllNurses()
      .then(response => {
        console.log('Response is', response);
        const {
          payload:{status, data}
        } = response;
        
        if (status === 200) {
          this.setState({isLoadingNurses: false, nurses: data})
        }else{
          this.setState({
            isLoadingNurses: false,
            nurses: null,
            errorMessage: "An error occurred fetching nurses."
          });
        }
      }).catch(() => {
        this.setState({
          isLoadingNurses: false,
          patients: null,
          errorMessage: "An error occurred."
        });
      });
  }

handleAssignPatient(patient){
 console.log('Patient info is ', patient)
 this.setState({selectedPatient: patient});
 this.showAvailableNurses()
 //this.showConfirmDialog('Confirmation', 'Are you sure you want to assign to nurse ?')
}
open(){
  this.setState({showModal: true, gender: 'male'})
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
columnGeneratorNurse(){
  return [
        {
            Header: 'S/N',
            accessor: 'sn',
        },
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
            Header: 'Date of birth',
            accessor: 'dob',
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
                  "dob",
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

}
generateNurseData(nurses) {
  return nurses.map((nurse, index) => {
      const { staff_id, first_name, last_name, dob, nationality, state_of_origin, phone_number, gender, address, createdAt} = nurse;
      const date = new Date(createdAt)
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      
      return ({
          sn: ++index,
          state_of_origin,
          dob,
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
  const {first_name, last_name, dob, gender, email_address, phone_number, address, occupation, nationality, state_of_origin,
  next_of_kin_address, next_of_kin_occupation, next_of_kin_phone_number, next_of_kin_name, next_of_kin_relationship}
   = this.state;
  let requestBody = {
    first_name,
    last_name,
    dob,
    gender,
    phone_number,
    address,
    occupation,
    nationality,
    email_address,
    state_of_origin,
    next_of_kin_address,
    next_of_kin_name,
    next_of_kin_occupation,
    next_of_kin_phone_number,
    next_of_kin_relationship
  };
  console.log('Nurse ', requestBody)
  this.setState({isLoadingCreateNurse: true});
      this.props.createNurse(requestBody)
      .then(res => {
        console.log('Response is', res)
        this.setState({isLoadingCreateNurse: false});
        if(res.payload.status === 201){
          this.setState({isLoadingCreateNurse: false, nurses: null, staffId: res.payload.data.staff_id});
          this.showAlert('Success', `Nurse has been created successfully.\n Staff Id is ${this.state.staffId}.
           Staff login credentials has been sent to their email address.`)
          this.fetchAllNurses();
        }else if(res.payload.response.status === 400){
          this.setState({isLoadingCreateNurse: false});
          this.showAlert('Error', 'An error occurred.')
        }
      }).catch(err => {
        this.setState({isLoadingCreateNurse: false});
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
                  title="Nurses"
                  category="All the nurses on the platform"
                  ctTableFullWidth
                  ctTableResponsive
                  showButton={true}
                  onButtonClick={() => this.open()}
                  buttonName="Add New Nurse"
                  content={
                    !this.state.nurses ? (
                      <Loading isLoading={this.state.isLoadingNurses} />
                    ) : (
                      <div className='data-table-div'><br/>
                                Search: <input value={this.state.filterAll} onChange={this.filterAll} /><br/><br/>
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
                    )
                  }
                />
              </Col>
            }
          </Row>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <ModalHeader closeButton>
            <ModalTitle>
              <strong>Setup Nurse</strong>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
          <Loading isLoading={this.state.isLoadingCreateNurse} />
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
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>Date of Birth< strong className = 'error-message'> *</strong></label >
              <input required type={'date'}
                onChange = {(e) => {this.setState({dob: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md ={3}>
            <div>
            <label>Gender <strong className = 'error-message' > * </strong></label>
              <FormControl
                    componentClass="select"
                    placeholder="select"
                    onChange={(e) => this.setState({gender: e.target.value})}
                  >
                  <option value={'male'} key={0}>Male</option>
                  <option value={'female'} key={1}>Female</option>
                  </FormControl>

             </div></Col>
            <Col md = {5}>
              <div className = {`form-group in-line`} >
              <label>Phone number< strong className = 'error-message'> *</strong></label >
              <input required type={'number'} maxLength ={11} minLength={11} placeholder = '07011223344'
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
            <Row>
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>Email Address< strong className = 'error-message'> *</strong></label >
              <input required type={'email'} placeholder = 'abc@xyz.com'
                onChange = {(e) => {this.setState({email_address: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>Nationality< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Nigeria'
                onChange = {(e) => {this.setState({nationality: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>State of origin< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Osun'
                onChange = {(e) => {this.setState({state_of_origin: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            
              <h5 className='margin-left'>Next of Kin Information</h5>
              <hr/>
              
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Name< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Olanshile'
                onChange = {(e) => {this.setState({next_of_kin_name: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
            <div className = {`form-group in-line`} >
            <label>Phone number< strong className = 'error-message'> *</strong></label >
            <input required type={'number'} maxLength ={11} minLength={11} placeholder = 'Phone number'
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
                Create Nurse
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

// function mapStateToProps(state) {
//   return {
//     token: state.adminToken.data.access_token
//   };
// }

export default connect(null, {
fetchAllNurses,
createNurse,
})(NurseManagement);
