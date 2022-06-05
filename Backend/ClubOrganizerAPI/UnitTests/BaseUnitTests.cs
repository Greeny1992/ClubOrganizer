using Context.Settings;
using Context.UnitOfWork;
using NUnit.Framework;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utilities;

namespace UnitTests
{
    public class BaseUnitTests
    {
        protected ILogger log = Logger.ContextLog<BaseUnitTests>();
        protected MongoDBUnitOfWork MongoUoW = null;
        protected MongoDBContext MongoContext = null;

        [OneTimeSetUp]
        public async Task Setup()
        {
            Logger.InitLogger();

            MongoUoW = new MongoDBUnitOfWork();
            MongoContext = MongoUoW.Context;

        }

        [Test]
        public void MyFirstLog()
        {
            log.Information("My first try");
            Assert.IsTrue(true);
        }
    }
}
