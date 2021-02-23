using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;

namespace WebApi.Controllers
{
    public class HobbiesController : ApiController
    {
        // GET api/<controller>
        public List<HobbiesDTO> Get()
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            return db.Hobbies.Select(x => new HobbiesDTO()
            {
                id = x.id,
                name = x.name,
            }).ToList();
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
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