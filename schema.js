
module.exports = {
  person_name:              { type: 'String' },
  person_email:             { type: 'String' },
  person_emailConfirmed:    { type: 'Boolean' },

  org_name:                 { type: 'String' },
  org_nzbnBusinessType:     { type: 'String' },
  org_legalEntityType:      { type: 'String' },
  org_nzbn:                 { type: 'String' },
  org_createdAt:            { type: 'Integer' },
  org_updatedAt:            { type: 'Integer' },
  
  relationship_subjectId:   { type: 'EntityID' },
  relationship_objectId:    { type: 'EntityID' },
  relationship_type:        { type: 'String' },

  settings_currentOrgId:    { type: 'EntityID' },

  qset_name:                { type: 'String' },
  qset_createdAt:           { type: 'Integer' },
  qset_updatedAt:           { type: 'Integer' },

  // questionsets have many questions
  qsetQuestion_qsetId:      { type: 'EntityID' },
  qsetQuestion_questionId:  { type: 'EntityID' },
  qsetQuestion_createdAt:   { type: 'Integer' },
  qsetQuestion_updatedAt:   { type: 'Integer' },

  question_body:            { type: 'String' },
  question_createdAt:       { type: 'Integer' },
  question_updatedAt:       { type: 'Integer' },

  answer_questionId:        { type: 'EntityID' },
  answer_orgId:             { type: 'EntityID' },
  answer_model:             { type: 'String' },
  answer_createdAt:         { type: 'Integer' },
  answer_updatedAt:         { type: 'Integer' },

  address_orgId:            { type: 'EntityID' },
  address_body:             { type: 'EntityID' },
  address_createdAt:         { type: 'Integer' },
  address_updatedAt:         { type: 'Integer' },

  location_name:            { type: 'String' },
  location_type:            { type: 'String' },
  location_code:            { type: 'String' },
  location_createdAt:       { type: 'Integer' },
  location_updatedAt:       { type: 'Integer' },

  file_name:                { type: 'String' },
  file_url:                 { type: 'String' },
  file_orgId:               { type: 'EntityID' },
  file_createdAt:           { type: 'Integer' },
  file_updatedAt:           { type: 'Integer' },

  fileSharedWith_fileId:    { type: 'EntityID' },
  fileSharedWith_agentId:   { type: 'EntityID' },
  fileSharedWith_createdAt: { type: 'Integer' },
  fileSharedWith_updatedAt: { type: 'Integer' },

  request_qsetId:          { type: 'EntityID' },
  request_requestorId:     { type: 'EntityID' },
  request_requesteeId:     { type: 'EntityID' },
  request_sentBy:          { type: 'EntityID' },
  request_sentAt:          { type: 'Date' },
  request_receivedAt:      { type: 'Date' },
  request_submittedAt:     { type: 'Date' },
  request_createdAt:       { type: 'Integer' },
  request_updatedAt:       { type: 'Integer' },

  report_name:             { type: 'String' },
  report_name:             { type: 'String' },

  reportFiles_fileId:      { type: 'EntityID' },
  reportFiles_reportsId:   { type: 'EntityID' },
  reportFiles_createdAt:   { type: 'Integer' },
  reportFiles_updatedAt:   { type: 'Integer' },




}
