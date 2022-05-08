using Context.DAL;
using Context.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context
{
    public class MonitoringFacade
    {
        public MongoDBUnitOfWork MongoDB { get; private set; }

        public Authentication Authentication { get; private set; }
        private MonitoringFacade()
        {
            MongoDB = new MongoDBUnitOfWork();

            Authentication = new Authentication(MongoDB);

        }

        private static MonitoringFacade _instance;

        public static MonitoringFacade Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new MonitoringFacade();
                }

                return _instance;
            }
        }

        public async Task Init()
        {
        }
    }
}
