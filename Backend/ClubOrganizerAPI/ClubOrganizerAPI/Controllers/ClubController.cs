using Context;
using Context.DAL;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ClubOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubController : ControllerBase
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpPost("CreatClub")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Club))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Club>> CreateClub([Required][FromBody] Club club)
        {
            Club cl = await mongo.Club.InsertOrUpdateOneAsync(club);


            if (cl != null)
            {


                return cl;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("ListClubs")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Club>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<Club>>> ListClubs()
        {


            List<Club> clbs = mongo.Club.FilterBy(x => true).ToList();


            if (clbs != null)
            {


                return clbs;
            }
            else
            {
                return NotFound();
            }

        }
    }
}
