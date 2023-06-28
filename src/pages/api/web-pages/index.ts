import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { webPageValidationSchema } from 'validationSchema/web-pages';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getWebPages();
    case 'POST':
      return createWebPage();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWebPages() {
    const data = await prisma.web_page
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'web_page'));
    return res.status(200).json(data);
  }

  async function createWebPage() {
    await webPageValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.scroll_setting?.length > 0) {
      const create_scroll_setting = body.scroll_setting;
      body.scroll_setting = {
        create: create_scroll_setting,
      };
    } else {
      delete body.scroll_setting;
    }
    const data = await prisma.web_page.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
