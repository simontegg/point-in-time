
module.exports = {
  person_name:               { type: 'String' },
  person_email:              { type: 'String' },
  person_emailConfirmed:     { type: 'Boolean' },
  person_createdAt:          { type: 'Date' },
  person_updatedAt:          { type: 'Date' },

  org_name:                  { type: 'String' },
  org_nzbnBusinessType:      { type: 'String' },
  org_legalEntityType:       { type: 'String' },
  org_color:                 { type: 'String' },
  org_nzbn:                  { type: 'Integer' },
  org_createdAt:             { type: 'Date' },
  org_updatedAt:             { type: 'Date' },
  
  relationship_type:         { type: 'String' },
  relationship_roleId:       { type: 'EntityID' },
  relationship_subjectId:    { type: 'EntityID' },
  relationship_objectId:     { type: 'EntityID' },
  relationship_volunteer:    { type: 'Boolean' },
  relationship_withChildren: { type: 'Boolean' },
  relationship_startDate:    { type: 'Date' },
  relationship_endDate:      { type: 'Date' },
  relationship_createdAt:    { type: 'Date' },
  relationship_updatedAt:    { type: 'Date' },

  role_name:                 { type: 'String' },
  role_orgId:                { type: 'EntityID' },
  role_description:          { type: 'String' },
  role_financial:            { type: 'Boolean' },
  role_governance:           { type: 'Boolean' },
  relationship_createdAt:    { type: 'Date' },
  relationship_updatedAt:    { type: 'Date' },

  settings_currentOrgId:     { type: 'EntityID' },

  qSet_name:                 { type: 'String' },
  qSet_createdAt:            { type: 'Date' },
  qSet_updatedAt:            { type: 'Date' },

  // questionsets have many questions
  qSetQuestion_qsetId:       { type: 'EntityID' },
  qSetQuestion_questionId:   { type: 'EntityID' },
  qSetQuestion_createdAt:    { type: 'Date' },
  qSetQuestion_updatedAt:    { type: 'Date' },

  question_body:             { type: 'String' },
  question_createdAt:        { type: 'Date' },
  question_updatedAt:        { type: 'Date' },

  answer_questionId:         { type: 'EntityID' },
  answer_orgId:              { type: 'EntityID' },
  answer_model:              { type: 'String' },
  answer_createdAt:          { type: 'Date' },
  answer_updatedAt:          { type: 'Date' },

  address_orgId:             { type: 'EntityID' },
  address_body:              { type: 'EntityID' },
  address_createdAt:         { type: 'Date' },
  address_updatedAt:         { type: 'Date' },

  location_name:             { type: 'String' },
  location_type:             { type: 'String' },
  location_code:             { type: 'String' },
  location_createdAt:        { type: 'Date' },
  location_updatedAt:        { type: 'Date' },

  file_name:                 { type: 'String' },
  file_url:                  { type: 'String' },
  file_orgId:                { type: 'EntityID' },
  file_createdAt:            { type: 'Date' },
  file_updatedAt:            { type: 'Date' },

  fileSharedWith_fileId:     { type: 'EntityID' },
  fileSharedWith_agentId:    { type: 'EntityID' },
  fileSharedWith_createdAt:  { type: 'Date' },
  fileSharedWith_updatedAt:  { type: 'Date' },

  request_name:              { type: 'String' },
  request_qSetId:            { type: 'EntityID' },
  request_requestorId:       { type: 'EntityID' },
  request_requesteeId:       { type: 'EntityID' },
  request_sentBy:            { type: 'EntityID' },
  request_sentAt:            { type: 'Date' },
  request_receivedAt:        { type: 'Date' },
  request_submittedAt:       { type: 'Date' },
  request_createdAt:         { type: 'Date' },
  request_updatedAt:         { type: 'Date' },

  report_name:               { type: 'String' },
  report_orgId:              { type: 'EntityID' },

  reportFiles_fileId:        { type: 'EntityID' },
  reportFiles_reportsId:     { type: 'EntityID' },
  reportFiles_createdAt:     { type: 'Date' },
  reportFiles_updatedAt:     { type: 'Date' },




}
