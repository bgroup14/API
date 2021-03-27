using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using DATA;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/member")]
    public class MemberController : ApiController
    {
        // GET api/<controller>
        public string Get()
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            Member member = db.Members.SingleOrDefault(x => x.fullName == "alan skverer");
            MemberDTO memberDTO = new MemberDTO();
            memberDTO.name = "My email address is: " + member.email;
            return memberDTO.name;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value test github";
        }
        [HttpPost]
        [Route("login")]
        public HttpResponseMessage Login(MemberLoginDTO memberLogin)
        {
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

                Member member = db.Members.SingleOrDefault(x => x.email == memberLogin.email);
                if (member == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "User dosent exists");
                }
                else
                {
                    if (member.password != memberLogin.password)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Incorrect password");
                    }
                }


                MemberDTO memberDTO = new MemberDTO()
                {
                    id = member.id,
                    name = member.fullName

                };
                var AuthorizedMemberDetails = db.FeedSettings.Where(x => x.memberId == member.id).Select(x => new AuthorizedMemberDetailsDTO
                {

                    id = member.id,
                    name = member.fullName,
                    helpType = x.memberType,
                    participantAge = x.participantAgeRange,
                    participantGender = x.participantGender,
                    meetingLocation = x.postLocation,
                    pictureUrl = member.pictureUrl

                });



                return Request.CreateResponse(HttpStatusCode.OK, AuthorizedMemberDetails);

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }



        [HttpPost]
        [Route("checkifmemberexists")]


        public HttpResponseMessage CheckIfMemberExists(MemberLoginDTO memberLogin)
        {
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

                Member member = db.Members.SingleOrDefault(x => x.email == memberLogin.email);
                if (member != null)
                {


                    var AuthorizedMemberDetails = db.FeedSettings.Where(x => x.memberId == member.id).Select(x => new AuthorizedMemberDetailsDTO
                    {

                        id = member.id,
                        name = member.fullName,
                        helpType = x.memberType,
                        participantAge = x.participantAgeRange,
                        participantGender = x.participantGender,
                        meetingLocation = x.postLocation,
                        pictureUrl = member.pictureUrl


                    });


                    return Request.CreateResponse(HttpStatusCode.OK, AuthorizedMemberDetails);
                }



                return Request.CreateResponse(HttpStatusCode.BadRequest, "User dosent exists");

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }




        [HttpPost]
        [Route("register")]
        public HttpResponseMessage Register(MemberSignupDTO memberSignupDTO)
        {
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
                Member member = new Member();
                member.email = memberSignupDTO.email;
                member.city = memberSignupDTO.city;
                member.password = memberSignupDTO.password;
                member.fullName = memberSignupDTO.fullName;
                member.pictureUrl = memberSignupDTO.pictureUrl;
                member.occupation = memberSignupDTO.occupation;
                member.gender = memberSignupDTO.gender;
                member.biography = memberSignupDTO.bio;
                member.dateOfBirth = memberSignupDTO.dateOfBirth;

                db.Members.Add(member);
                db.SaveChanges();
                FeedSetting feedSetting = new FeedSetting
                {
                    memberId = member.id,
                    memberType = memberSignupDTO.feedSettings.memberType,
                    participantAgeRange = memberSignupDTO.feedSettings.participantAgeRange,
                    participantGender = memberSignupDTO.feedSettings.participantGender,
                    postLocation = memberSignupDTO.feedSettings.postLocation
                };
                db.FeedSettings.Add(feedSetting);
                /* db.SaveChanges();*/






                foreach (HobbiesDTO hobby in memberSignupDTO.hobbies)
                {

                    MembersHobby hobbies = new MembersHobby();
                    hobbies.hobbyId = hobby.id;
                    hobbies.memberId = member.id;
                    db.MembersHobbies.Add(hobbies);

                }


                db.SaveChanges();

                AuthorizedMemberDetailsDTO authorizedMemberDetailsDTO = new AuthorizedMemberDetailsDTO()
                {
                    id = member.id,
                    name = member.fullName,
                    participantAge = memberSignupDTO.feedSettings.participantAgeRange,
                    participantGender = memberSignupDTO.feedSettings.participantGender,
                    helpType = memberSignupDTO.feedSettings.memberType,
                    meetingLocation = memberSignupDTO.feedSettings.postLocation,
                    pictureUrl = member.pictureUrl
                };

                return Request.CreateResponse(HttpStatusCode.OK, authorizedMemberDetailsDTO);

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }








        [HttpPut]
        [Route("Updateprofile/{userId}")]
        public HttpResponseMessage UpdateProfile(ProfileDetailsDTO profileDetailsDTO, int userId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            Member member = db.Members.Where(x => x.id == userId).FirstOrDefault();

            try
            {

                if (profileDetailsDTO.unixDate == null)
                {
                    member.city = profileDetailsDTO.city;
                    member.biography = profileDetailsDTO.bio;
                    member.occupation = profileDetailsDTO.occupation;
                    member.gender = profileDetailsDTO.gender;
                    member.pictureUrl = profileDetailsDTO.pictureUrl;
                }
                else
                {
                    member.city = profileDetailsDTO.city;
                    member.biography = profileDetailsDTO.bio;
                    member.occupation = profileDetailsDTO.occupation;
                    member.gender = profileDetailsDTO.gender;
                    member.pictureUrl = profileDetailsDTO.pictureUrl;
                    member.dateOfBirth = profileDetailsDTO.unixDate;
                }

                if (profileDetailsDTO.hobbies != null)
                {
                    foreach (MembersHobby hobby in db.MembersHobbies.Where(x => x.memberId == userId))
                    {
                        MembersHobby membersHobby = hobby;
                        db.MembersHobbies.Remove(membersHobby);
                    }

                    foreach (HobbiesDTO hobby in profileDetailsDTO.hobbies)
                    {

                        MembersHobby hobbies = new MembersHobby();
                        hobbies.hobbyId = hobby.id;
                        hobbies.memberId = member.id;
                        db.MembersHobbies.Add(hobbies);

                    }
                }
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Profile updated successfully");

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }

        [HttpPut]
        [Route("updatefeedsettings/{userId}")]
        public HttpResponseMessage UpdateFeedSettings(FeedSettingsDTO feedSettingsDTO, int userId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();  
            FeedSetting feedSetting = db.FeedSettings.Where(x => x.memberId == userId).FirstOrDefault();
            try
            {

                feedSetting.memberType = feedSettingsDTO.memberType;
                feedSetting.participantAgeRange = feedSettingsDTO.participantAgeRange;
                feedSetting.participantGender = feedSettingsDTO.participantGender;
                feedSetting.postLocation = feedSettingsDTO.postLocation;
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Feed settings updated successfully");
            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


















        [HttpGet]
        [Route("getmyprofile/{id}")]
        public HttpResponseMessage GetMyProfile(int id)
        {



            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

                Member member = db.Members.SingleOrDefault(x => x.id == id);
                int unixDateOfBirth = (int)member.dateOfBirth;
                DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                dtDateTime = dtDateTime.AddSeconds(unixDateOfBirth).ToLocalTime();
                var today = DateTime.Today;
                // Calculate the age.
                int age = today.Year - dtDateTime.Year;
                // Go back to the year in which the person was born in case of a leap year
                if (dtDateTime.Date > today.AddYears(-age)) { age--; }
                string dateOfBirth = dtDateTime.ToString();
                string dateOfBirthLabel = dateOfBirth.Substring(0, dateOfBirth.IndexOf(" "));

                ProfileDetailsDTO profileDetailsDTO = new ProfileDetailsDTO()
                {
                    pictureUrl = member.pictureUrl,
                    fullName = member.fullName,
                    age = age,
                    city = member.city,
                    occupation = member.occupation,
                    bio = member.biography,
                    gender = member.gender,
                    dateOfBirth = dateOfBirthLabel,

                    hobbies = db.MembersHobbies.Where(h => h.memberId == member.id).Select(z => new HobbiesDTO
                    {
                        name = z.Hobby.name
                    }).ToList()

                };


                return Request.CreateResponse(HttpStatusCode.OK, profileDetailsDTO);



            }
            catch (Exception e)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, e.Message);


            }

        }
















        [HttpGet]
        [Route("getmembersbysearchword/{searchWord}")]
        public HttpResponseMessage GetMembersBySearchWord(string searchWord)
        {



            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
                var usersWIthSearchWord = db.Members.Where(x => x.fullName.Contains(searchWord)).ToList();
                List<ProfileDetailsDTO> usersToSend = new List<ProfileDetailsDTO>();
                foreach (Member m in usersWIthSearchWord)
                {

                    //calculate age
                    /*int unixDateOfBirth = (int)m.dateOfBirth;
                    DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                    dtDateTime = dtDateTime.AddSeconds(unixDateOfBirth).ToLocalTime();
                    var today = DateTime.Today;
                    // Calculate the age.
                    int age = today.Year - dtDateTime.Year;
                    // Go back to the year in which the person was born in case of a leap year
                    if (dtDateTime.Date > today.AddYears(-age)) { age--; }*/

                    ProfileDetailsDTO profileDTO = new ProfileDetailsDTO()
                    {
                        fullName=m.fullName,
                        /*age = age,*/
                        pictureUrl = m.pictureUrl,
                        memberId=m.id

                    };
                    usersToSend.Add(profileDTO);

                };





                return Request.CreateResponse(HttpStatusCode.OK, usersToSend);



            }
            catch (Exception e)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, e.Message);


            }

        }





        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}