using Context;
using Context.DAL;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ClubOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubController : ControllerBase
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpPost("CreateClub")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Club))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Club>> CreateClub([Required][FromBody] Club club)
        {

            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(userId != null)
            {
                User usr = await mongo.User.FindByIdAsync(userId);
                club.OwnerID = userId;
                
            
                Club cl = await mongo.Club.InsertOrUpdateOneAsync(club);

                usr.OwnedClub = cl.ID;
                await mongo.User.InsertOrUpdateOneAsync(usr);

                if (cl != null)
                {


                    return cl;
                }
                else
                {
                    return NotFound();
                }
            }

            return NotFound();
            
            

        }

        [HttpGet("ListClubs")]
        [Authorize(Roles = "Admin")]
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

        [HttpPost("CreateEventForClub")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Club))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Club>> CreateEventForClub([Required][FromBody] Event ev, [Required][FromQuery] string clubId)
        {
            
            Club cl = await mongo.Club.AddEventToClub(clubId, ev);


            if (cl != null)
            {


                return cl;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpPost("CreateGroupForClub")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Club))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Club>> CreateGroupForClub([Required][FromBody] Group group, [Required][FromQuery] string clubId)
        {
            Club cl = await mongo.Club.AddGroupToClub(clubId, group);


            if (cl != null)
            {


                return cl;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpPost("AddMemberToClub")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Club))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Club>> AddMemberToClub([Required][FromQuery] string userId, [Required][FromQuery] string clubId)
        {
            Club cl = await mongo.Club.AddUserToClub(clubId, userId);


            if (cl != null)
            {


                return cl;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("GetClub")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Club))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Club>> GetClub([Required][FromQuery] string clubId)
        {
            Club cl = await mongo.Club.FindByIdAsync(clubId);

            if (cl != null)
            {


                return cl;
            }
            else
            {
                return NotFound();
            }

        }


    }
}
