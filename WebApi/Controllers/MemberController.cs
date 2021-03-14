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
                return Request.CreateResponse(HttpStatusCode.OK, memberDTO);

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
                    MemberDTO memberDTO = new MemberDTO()
                    {
                        id = member.id,
                        name = member.fullName,
                        

                    };
                    return Request.CreateResponse(HttpStatusCode.OK, memberDTO);
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
        public HttpResponseMessage Register([FromBody] string value)
        {
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

                var postData = Request.RequestUri.ParseQueryString()["data"].ToString();
                var jsonData = (JObject)JsonConvert.DeserializeObject(postData);

                string sqlMembers = "INSERT INTO [Members] (email, password, fullName, city, occupation, biography) VALUES ('" + jsonData["signUpDetails"]["email"] + "', '" + jsonData["signUpDetails"]["password"] + "', '" + jsonData["signUpDetails"]["fullName"] + "', '" + jsonData["profileSetupDetails"]["city"] + "', '" + jsonData["profileSetupDetails"]["occupation"] + "', '" + jsonData["profileSetupDetails"]["bio"] + "')";
                //return Request.CreateResponse(HttpStatusCode.OK, sqlMembers);
                db.Database.ExecuteSqlCommand(sqlMembers);

                string memberEmail = jsonData["signUpDetails"]["email"].ToString();

                Member member = db.Members.SingleOrDefault(x => x.email == memberEmail);
                if (member != null)
                {

                    string sqlFeedSettings = "INSERT INTO [FeedSettings] (memberId, memberType, postLocation, participantGender, participantAgeRange) VALUES ('" + member.id + "', '" + jsonData["feedSettings"]["memberType"] + "', '" + jsonData["feedSettings"]["postsLocation"] + "', '" + jsonData["feedSettings"]["fromGender"].ToString().Replace("'", "") + "', '" + jsonData["feedSettings"]["participantAgeRange"] + "')";
                    //return Request.CreateResponse(HttpStatusCode.OK, sqlFeedSettings);
                    db.Database.ExecuteSqlCommand(sqlFeedSettings);

                    string sqlHobbies = "INSERT INTO [MembersHobbies] (memberId, hobbyId) VALUES ";
                    foreach (JObject hobby in jsonData["hobbies"])
                    {
                        sqlHobbies = sqlHobbies + "('" + member.id + "', '" + hobby["id"] + "'), ";
                    }
                    sqlHobbies = sqlHobbies.Remove(sqlHobbies.Length - 2);
                    //return Request.CreateResponse(HttpStatusCode.OK, sqlHobbies);
                    db.Database.ExecuteSqlCommand(sqlHobbies);

                    MemberDTO memberDTO = new MemberDTO()
                    {
                        id = member.id,
                        name = member.fullName,
                        helpType = member.helpType,
                        gender = member.gender,
                        dateOfBirth = member.dateOfBirth

                    };
                    return Request.CreateResponse(HttpStatusCode.OK, memberDTO);
                }



                return Request.CreateResponse(HttpStatusCode.BadRequest, "User creation failed");

            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured (User probably already exists): "+e.Message);
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