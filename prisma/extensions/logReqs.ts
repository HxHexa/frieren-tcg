import { Prisma } from "@prisma/client";

const logReqsExt = Prisma.defineExtension({
  query: {
    $allModels: {
      $allOperations({ model, operation, args, query }) {
        console.log(
          `Model:\n${model}\nOperation:\n${operation}\nArgs:\n${JSON.stringify(args)}`,
        );
        return query(args);
      },
    },
  },
});

export default logReqsExt;
