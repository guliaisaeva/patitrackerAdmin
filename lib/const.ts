const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const CONST = {
  getAllAnnouncementURL: `${BASE_URL}/api/v1/Information/GetAllAnnouncementWeb`,
  getAnnouncementDetailURL: `${BASE_URL}/api/v1/Information/GetAnnouncementDetailWebAsync`,
  addAnnouncementURL: `${BASE_URL}/api/v1/Information/AddAnnouncement`,
  deleteAnnouncementURL: `${BASE_URL}/api/v1/Information/DeleteAnnouncement`,
  updateAnnouncementURL: `${BASE_URL}/api/v1/Information/UpdateAnnouncement`,

  getAllDeviceURL: `${BASE_URL}/api/v1/Device/GetAllDevices`,
  getDeviceDetailURL: `${BASE_URL}/api/v1/Device/GetDeviceDetail`,
  addDeviceURL: `${BASE_URL}/api/v1/Device/AddDevice`,
  deleteDeviceURL: `${BASE_URL}/api/v1/Device/DeleteDevice`,
  getAllDeviceForConnectSimURL: `${BASE_URL}/api/v1/Device/GetAllDeviceForConnectSim`,

  getAllQuestionURL: `${BASE_URL}/api/v1/Information/GetAllFrequentlyAskedQuestion`,
  getQuestionDetailURL: `${BASE_URL}/api/v1/Information/GetFrequentlyAskedQuestionDetail`,
  addQuestionURL: `${BASE_URL}/api/v1/Information/AddFrequentlyAskedQuestion`,
  deleteQuestionURL: `${BASE_URL}/api/v1/Information/DeleteFrequentlyAskedQuestion`,
  updateQuestionURL: `${BASE_URL}/api/v1/Information/UpdateFrequentlyAskedQuestion`,

  getAllManagerURL: `${BASE_URL}/api/v1/SuperAdmin/GetAllAdmin`,
  getManagerDetailURL: `${BASE_URL}/api/v1/SuperAdmin/GetAdminById`,
  addManagerURL: `${BASE_URL}/api/v1/SuperAdmin/RegisterAdmin`,
  deleteManagerURL: `${BASE_URL}/api/v1/SuperAdmin/DeleteAdmin`,
  updateManagerURL: `${BASE_URL}/api/v1/SuperAdmin/UpdateProfileSuperAdmin`,

  getAllCitiesURL: `${BASE_URL}/api/v1/Information/GetAllCity`,
  getAllDistrictsURL: `${BASE_URL}/api/v1/Information/GetAllDistrict`,
  getLanguagesURL: `${BASE_URL}/api/v1/Information/GetAllMobileLanguage`,
  getAllPhoneCodesURL: `${BASE_URL}/api/v1/Information/GetAllPhoneCode`,

  loginURL: `${BASE_URL}/api/v1/ManagerAuth/Login`,

  getAllPetBreedURL: `${BASE_URL}/api/v1/Pet/GetAllPetBreed`,
  getPetBreedDetailURL: `${BASE_URL}/api/v1/Pet/GetPetBreed`,
  addPetBreedURL: `${BASE_URL}/api/v1/Pet/AddPetBreed`,
  deletePetBreedURL: `${BASE_URL}/api/v1/Pet/DeletePetBreed`,
  updatePetBreedURL: `${BASE_URL}/api/v1/Pet/UpdatePetBreed`,
  searchPetBreedURL: `${BASE_URL}/api/v1/Pet/PetBreedSearch`,

  getAllPetTypeURL: `${BASE_URL}/api/v1/Pet/GetAllPetType`,
  getPetTypeDetailURL: `${BASE_URL}/api/v1/Pet/GetPetType`,
  addPetTypeURL: `${BASE_URL}/api/v1/Pet/AddPetType`,
  deletePetTypeURL: `${BASE_URL}/api/v1/Pet/DeletePetType`,
  updatePetTypeURL: `${BASE_URL}/api/v1/Pet/UpdatePetType`,

  getAllSimURL: `${BASE_URL}/api/v1/SimCard/GetAllSimCards`,
  getSimDetailURL: `${BASE_URL}/api/v1/SimCard/GetSimCardsDetail`,
  addSimURL: `${BASE_URL}/api/v1/SimCard/AddSimCard`,
  deleteSimURL: `${BASE_URL}/api/v1/SimCard/DeleteSimCard`,
  updateSimURL: `${BASE_URL}/api/v1/Pet/UpdatePetType`,
  getAllSimsForConnectDeviceURL: `${BASE_URL}/api/v1/SimCard/GetAllSimForConnectDevice`,

  getAllUserURL: `${BASE_URL}/api/v1/User/GetAllUser`,
  getUserDetailURL: `${BASE_URL}/api/v1/User/GetUser`,
  getSuperAdminDetailURL: `${BASE_URL}/api/v1/SuperAdmin/GetAdminDetail`,
  searchUserURL: `${BASE_URL}/api/v1/User/SearchUser`,

  getAllTermsOfUse: `${BASE_URL}/api/v1/Information/GetTermsOfUse`,
  updateTermsOfUse: `${BASE_URL}/api/v1/Information/UpdateTermsOfUse`,

  getAllPrivacyPolicy: `${BASE_URL}/api/v1/Information/GetPrivacyPolicy`,
  updatePrivacyPolicy: `${BASE_URL}/api/v1/Information/UpdatePrivacyPolicy`,
};
