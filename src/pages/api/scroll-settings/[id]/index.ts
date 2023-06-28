import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { scrollSettingValidationSchema } from 'validationSchema/scroll-settings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.scroll_setting
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getScrollSettingById();
    case 'PUT':
      return updateScrollSettingById();
    case 'DELETE':
      return deleteScrollSettingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getScrollSettingById() {
    const data = await prisma.scroll_setting.findFirst(convertQueryToPrismaUtil(req.query, 'scroll_setting'));
    return res.status(200).json(data);
  }

  async function updateScrollSettingById() {
    await scrollSettingValidationSchema.validate(req.body);
    const data = await prisma.scroll_setting.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteScrollSettingById() {
    const data = await prisma.scroll_setting.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
